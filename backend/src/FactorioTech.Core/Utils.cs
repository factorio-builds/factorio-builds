using System;
using System.Runtime.CompilerServices;

namespace FactorioTech.Core
{
    public static class Utils
    {
        /// <summary>
        /// Shamelessly stolen from Kotlin
        ///
        ///     inline fun <T, R> T.let(block: (T) -> R): R
        ///
        /// see https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html
        /// </summary>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static R Let<T, R>(this T v, Func<T, R> f) => f(v);

        public static string GetWikiUrlForEntity(string key) =>
            $"https://wiki.factorio.com/{GetWikiKeyForEntity(key)}";

        public static string GetWikiKeyForEntity(string key) =>
            key switch
            {
                "small-lamp" => "Lamp",
                "logistic-chest-passive-provider" => "Passive_provider_chest",
                "logistic-chest-active-provider" => "Active_provider_chest",
                "logistic-chest-requester" => "Requester_chest",
                "logistic-chest-buffer" => "Buffer_chest",
                "logistic-chest-storage" => "Storage_chest",
                "stone-wall" => "Wall",
                "straight-rail" => "Rail",
                { } k => k[..1].ToUpperInvariant() + k[1..].Replace("-", "_"),
            };

        public static Version DecodeGameVersion(ulong version)
        {
            var bytes = BitConverter.GetBytes(version).AsSpan();

            return new Version(
                BitConverter.ToUInt16(bytes[6..8]),
                BitConverter.ToUInt16(bytes[4..6]),
                BitConverter.ToUInt16(bytes[2..4]),
                BitConverter.ToUInt16(bytes[0..2]));
        }
    }
}