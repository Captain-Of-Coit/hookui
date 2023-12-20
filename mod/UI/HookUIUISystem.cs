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
using System.Collections.Immutable;
using Colossal.Json;
using UnityEngine.InputSystem;
using UnityEngine.UIElements;
using Game.Vehicles;
using UnityEngine.UIElements.Collections;
using Newtonsoft.Json;
using Colossal.Logging;

namespace HookUI.UI {
    class HookUIUISystem : UISystemBase {
        public static ILog Log { get; private set; }

        private HashSet<string> availableExtensions = new HashSet<string>();
        private HashSet<string> visiblePanels = new HashSet<string>();
        private ImmutableDictionary<string, PanelPosition> panelPositions;
        private ImmutableDictionary<string, PanelSize> panelSizes;

        private bool isMenuOpen = false;

        private string kGroup = "hookui";
        protected override void OnCreate() {
            base.OnCreate();

            Log = LogManager.GetLogger(nameof(HookUIUISystem));

            this.panelPositions = ImmutableDictionary.Create<string, PanelPosition>();
            this.panelSizes = ImmutableDictionary.Create<string, PanelSize>();

            // Make available in UI what panels are currently visible
            this.AddUpdateBinding(new GetterValueBinding<HashSet<string>>(this.kGroup, "visible_panels", () => {
                return this.visiblePanels;
            }, new HashSetWriter<string>()));

            // Make available in UI which extensions we've found via C# reflection
            this.AddUpdateBinding(new GetterValueBinding<HashSet<string>>(this.kGroup, "available_extensions", () => {
                return this.availableExtensions;
            }, new HashSetWriter<string>()));

            // Share the state of menu visibility to the Game UI
            this.AddUpdateBinding(new GetterValueBinding<bool>(this.kGroup, "is_menu_open", () => {
                return this.isMenuOpen;
            }));

            // Share the state of the panel positions
            this.AddUpdateBinding(new GetterValueBinding<string>(this.kGroup, "panel_positions", () => {
                string output = JsonConvert.SerializeObject(this.panelPositions);
                return output;
            }));

            // Share the state of the panel sizes
            this.AddUpdateBinding(new GetterValueBinding<string>(this.kGroup, "panel_sizes", () => {
                string output = JsonConvert.SerializeObject(this.panelSizes);
                return output;
            }));

            // UI => C# Bindings

            // Allow the UI to call `hookui.toggle_menu <bool>` to toggle menu
            this.AddBinding(new TriggerBinding<bool>(this.kGroup, "toggle_menu", (is_open) => {
                this.isMenuOpen = is_open;
            }));

            // Sets which panels should be visible
            this.AddBinding(new TriggerBinding<HashSet<string>>(this.kGroup, "set_visible_panels", (panels) => {
                this.visiblePanels = panels;
            }, new HashSetReader<string>()));

            // Persist panel position
            this.AddBinding(new TriggerBinding<string, string>(this.kGroup, "set_panel_position", (panel_id, panel_position_str) => {
                PanelPosition panel_position = JsonConvert.DeserializeObject<PanelPosition>(panel_position_str);
                this.panelPositions = this.panelPositions.SetItem(panel_id, panel_position);
            }));

            // Persist panel size
            this.AddBinding(new TriggerBinding<string, string>(this.kGroup, "set_panel_size", (panel_id, panel_size_str) => {
                PanelSize panel_size = JsonConvert.DeserializeObject<PanelSize>(panel_size_str);
                this.panelSizes = this.panelSizes.SetItem(panel_id, panel_size);
            }));


            Log.Info("Finding hookui extensions");
            // Finding all extensions
            var baseType = typeof(HookUILib.Core.UIExtension);
            var derivedTypes = AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(assembly => assembly.GetTypes())
                .Where(type => type.IsSubclassOf(baseType));

            foreach (var type in derivedTypes) {
                var instance = Activator.CreateInstance(type);

                var uiName = type.FullName;
                var extensionID = type.GetField("extensionID", BindingFlags.Public | BindingFlags.Instance).GetValue(instance);
                string extensionContent = (string)type.GetField("extensionContent", BindingFlags.Public | BindingFlags.Instance).GetValue(instance);
                var extensionFilename = $"panel.{extensionID}.js";

                Log.Info($"{uiName} extensionPath: {extensionID}, extensionContent length: {extensionContent.Length}");
                var installPath = Path.Combine(Application.dataPath, "StreamingAssets", "~UI~", "HookUI", "Extensions", extensionFilename);
                Log.Info($"{uiName} installPath: {installPath}");
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

    internal class HashSetReader<T> : IReader<HashSet<T>> {
        private readonly IReader<T> m_ItemReader;

        public HashSetReader(IReader<T> itemReader = null) {
            m_ItemReader = itemReader ?? ValueReaders.Create<T>();
        }

        public void Read(IJsonReader reader, out HashSet<T> value) {
            value = new HashSet<T>();

            var arraySize = reader.ReadArrayBegin();
            for (uint i = 0; i < arraySize; i++) {
                reader.ReadArrayElement(i);

                T item;
                m_ItemReader.Read(reader, out item);
                value.Add(item);
            }

            reader.ReadArrayEnd();
        }
    }

    public record PanelPosition {
        public int top;
        public int left;
    }

    public record PanelSize {
        public int height;
        public int width;
    }
}