# `rule-engine`

Custom rule engine for intuitively building complex boolean AND / OR queries of all kinds.

## Usage

See @content-control/block-editor for working usage.

```jsx
<RuleEngine
    value={ query }
    onChange={ ( query ) => {} }
    options={ {
        features: {
            notOperand: true,
            groups: true,
            nesting: false,
        },
        rules: builderRules,
    } }
/>
```
