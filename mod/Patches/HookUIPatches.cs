using System.Collections.Generic;
using System.Linq;
using Colossal.UI;
using Game.SceneFlow;
using Game.UI;
using HarmonyLib;
using System.Reflection.Emit;

namespace HookUIMod.Patches {
    [HarmonyPatch(typeof(GameManager))]
    [HarmonyPatch("InitializeUI")]
    public static class GameManager_InitializeUIPatch {
        public static IEnumerable<CodeInstruction> Transpiler(IEnumerable<CodeInstruction> instructions) {
            var codes = new List<CodeInstruction>(instructions);
            var originalString = "/~UI~/GameUI";
            var newString = "/~UI~/HookUI";

            for (int i = 0; i < codes.Count; i++) {
                if (codes[i].opcode == OpCodes.Ldstr && (string)codes[i].operand == originalString) {
                    UnityEngine.Debug.Log($"Replacing string: {codes[i].operand} with {newString}");
                    codes[i].operand = newString;
                    //break; // Assuming there's only one occurrence to replace
                }
                //if (codes[i].opcode == OpCodes.Ldstr && (string)codes[i].operand == "gameui") {
                //    codes[i].operand = "HookUI";
                //    //break; // Assuming there's only one occurrence to replace
                //}
            }

            return codes.AsEnumerable();
        }
    }

    [HarmonyPatch(typeof(UISystemBootstrapper))]
    [HarmonyPatch("Awake")]
    public static class UISystemBootstrapper_AwakePatch {
        public static IEnumerable<CodeInstruction> Transpiler(IEnumerable<CodeInstruction> instructions) {
            var codes = new List<CodeInstruction>(instructions);
            var originalString = "/~UI~/GameUI";
            var newString = "/~UI~/HookUI";

            for (int i = 0; i < codes.Count; i++) {
                if (codes[i].opcode == OpCodes.Ldstr && (string)codes[i].operand == originalString) {
                    UnityEngine.Debug.Log($"Replacing string: {codes[i].operand} with {newString}");
                    codes[i].operand = newString;
                    //break; // Assuming there's only one occurrence to replace
                }
                //if (codes[i].opcode == OpCodes.Ldstr && (string)codes[i].operand == "gameui") {
                //    codes[i].operand = "HookUIMod";
                //    //break; // Assuming there's only one occurrence to replace
                //}
            }

            return codes.AsEnumerable();
        }
    }
}