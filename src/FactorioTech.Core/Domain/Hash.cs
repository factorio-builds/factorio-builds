using System;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace FactorioTech.Core.Domain
{
    [TypeConverter(typeof(HashConverter))]
    public readonly struct Hash
    {
        private readonly string _value;

        private Hash(string value) => _value = value;

        public static Hash Empty => new(string.Empty);

        public static Hash Parse(string value) =>
            Regex.IsMatch(value, "^[a-f0-9]{32}$", RegexOptions.Compiled)
                ? new Hash(value)
                : throw new ArgumentOutOfRangeException(nameof(value), "The provided input is not a valid hash.");

        public static Hash Compute(string input) =>
            new(string.Join(string.Empty, MD5.Create()
                .ComputeHash(Encoding.UTF8.GetBytes(input))
                .Select(b => b.ToString("X2".ToLowerInvariant()))));

        public bool Equals(Hash other) => _value == other._value;
        public override bool Equals(object? obj) => obj is Hash other && Equals(other);
        public override int GetHashCode() => _value.GetHashCode();
        public static bool operator ==(Hash left, Hash right) => left.Equals(right);
        public static bool operator !=(Hash left, Hash right) => !left.Equals(right);
        public static explicit operator Hash(string other) => new(other);
        public static explicit operator string(Hash other) => other._value;
        public override string ToString() => _value;

        public sealed class HashConverter : TypeConverter
        {
            public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType) => sourceType == typeof(string);
            public override bool CanConvertTo(ITypeDescriptorContext context, Type destinationType) => destinationType == typeof(Hash);

            public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value) =>
                Hash.Parse(value as string ?? value.ToString() ?? throw new ArgumentException(nameof(value)));

            public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType) =>
                value.ToString() ?? throw new ArgumentException(nameof(value));
        }
    }
}
