using System.IO;

namespace HookUILib.Core
{
    public enum ExtensionType {
        Panel,
        // Setting
        // Tooltip
        // Other fun injection points
    }

    public class UIExtension {
        public readonly string extensionID;
        public readonly string extensionContent;
        public readonly ExtensionType extensionType;
        public virtual string LoadEmbeddedResource(string resourceName) {
            var assembly = this.GetType().Assembly;

            using (Stream stream = assembly.GetManifestResourceStream(resourceName))
            using (StreamReader reader = new StreamReader(stream)) {
                return reader.ReadToEnd();
            }
        }
    }
}
