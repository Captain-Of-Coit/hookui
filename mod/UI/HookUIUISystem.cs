// Yes, the filename is clearly fun and incidental, HookUI-UISystem
using Colossal.UI.Binding;
using Game.UI;
using System;
using System.Collections.Generic;
using System.IO;
using Colossal.Annotations;
using System.Reflection;
using UnityEngine;
using System.Linq;

namespace HookUI.UI {
    class HookUIUISystem : UISystemBase {
        private HashSet<string> availableExtensions = new HashSet<string>();
        private bool isMenuOpen = false;

        private string kGroup = "hookui";
        protected override void OnCreate() {
            base.OnCreate();

            // Make available in UI which extensions we've found via C# reflection
            this.AddUpdateBinding(new GetterValueBinding<HashSet<string>>(this.kGroup, "available_extensions", () => {
                return this.availableExtensions;
            }, new HashSetWriter<string>()));

            // Share the state of menu visibility to the Game UI
            this.AddUpdateBinding(new GetterValueBinding<bool>(this.kGroup, "is_menu_open", () => {
                return this.isMenuOpen;
            }));

            // Allow the UI to call `hookui.toggle_menu <bool>` to toggle menu
            this.AddBinding(new TriggerBinding<bool>(this.kGroup, "toggle_menu", (is_open) => {
                this.isMenuOpen = is_open;
            }));

            UnityEngine.Debug.Log("Finding hookui extensions");
            // Finding all extensions
            var baseType = typeof(HookUILib.Core.UIExtension);
            var derivedTypes = AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(assembly => assembly.GetTypes())
                .Where(type => type.IsSubclassOf(baseType));

            foreach (var type in derivedTypes) {
                var instance = Activator.CreateInstance(type);

                var uiName = type.FullName;
                var extensionID = type.GetField("extensionID", BindingFlags.Public | BindingFlags.Instance).GetValue(instance);
                string extensionContent = (string) type.GetField("extensionContent", BindingFlags.Public | BindingFlags.Instance).GetValue(instance);
                var extensionFilename = $"panel.{extensionID}.js";

                UnityEngine.Debug.Log($"{uiName} extensionPath: {extensionID}, extensionContent length: {extensionContent.Length}");
                var installPath = Path.Combine(Application.dataPath, "StreamingAssets", "~UI~", "HookUI", "Extensions", extensionFilename);
                UnityEngine.Debug.Log($"{uiName} installPath: {installPath}");
                File.WriteAllText(installPath, extensionContent);
                AddExtension(extensionFilename);
            }
        }

        public void AddExtension(string id) {
            availableExtensions.Add(id);
        }
    }

    internal class HashSetWriter<T> : IWriter<HashSet<T>> {
        [NotNull]
        private readonly IWriter<T> m_ItemWriter;

        public HashSetWriter(IWriter<T> itemWriter = null) {
            m_ItemWriter = itemWriter ?? ValueWriters.Create<T>();
        }

        public void Write(IJsonWriter writer, HashSet<T> value) {
            if (value != null) {
                writer.ArrayBegin(value.Count);
                foreach (T item in value) {
                    m_ItemWriter.Write(writer, item);
                }

                writer.ArrayEnd();
                return;
            }

            writer.WriteNull();
            throw new ArgumentNullException("value", "Null passed to non-nullable hashset writer");
        }
    }
}
