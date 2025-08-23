import ObjectPage from '../components/ObjectPage'

export default function IntlPage() {
  return (
    <ObjectPage
      title="Intl"
      description="Provides internationalization and localization"
      overview="The Intl object provides internationalization and localization features."
      syntax={`// Number formatting
const number = 1234567.89;

const usFormatter = new Intl.NumberFormat('en-US');
console.log(usFormatter.format(number)); // '1,234,567.89'

const deFormatter = new Intl.NumberFormat('de-DE');
console.log(deFormatter.format(number)); // '1.234.567,89'

// Currency formatting
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});
console.log(currencyFormatter.format(number)); // '$1,234,567.89'

// Date formatting
const date = new Date();

const usDateFormatter = new Intl.DateTimeFormat('en-US');
console.log(usDateFormatter.format(date)); // '12/25/2023'

const deDateFormatter = new Intl.DateTimeFormat('de-DE');
console.log(deDateFormatter.format(date)); // '25.12.2023'

// Collator for string comparison
const collator = new Intl.Collator('de');
const words = ['café', 'cafe', 'caffè'];
words.sort(collator.compare);
console.log(words); // ['cafe', 'café', 'caffè']

// Plural rules
const pluralRules = new Intl.PluralRules('en-US');
console.log(pluralRules.select(0)); // 'other'
console.log(pluralRules.select(1)); // 'one'
console.log(pluralRules.select(2)); // 'other'`}
      useCases={[
        "Internationalization",
        "Number formatting",
        "Date formatting",
        "String localization"
      ]}
    />
  )
}
