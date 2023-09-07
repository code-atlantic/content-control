# Query Builder

## Drag & Drop / Sorting

Drag, Drop & Sort functionality currently implemented using [React Sortable](https://github.com/SortableJS/react-sortablejs) components, based on [SortableJS](https://github.com/SortableJS/Sortable). Nesting of these drag & drop structures required a custom implementation, examples of which located here:

-   [Simple Version We Used](https://codesandbox.io/s/misty-wood-g8lkj)
-   [More Complex Version](https://codesandbox.io/s/react-sortable-js-nested-forked-ykxgpq)

This method essentially passes an indexs list through to each child, using it to properly traverse the structure to update state.

### Alternatives

-   **dnd-kit**: [Source](https://github.com/clauderic/dnd-kit) - [Docs](https://docs.dndkit.com/) - [Examples](https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/?path=/story/core-draggable-hooks-usedraggable--basic-setup)
-   **html5 native**: [Examples](https://www.pluralsight.com/guides/drag-and-drop-react-components)
-   **react-sortable-hoc**`deprecated`: [Source](https://github.com/clauderic/react-sortable-hoc) / [Nested Lists](https://jsfiddle.net/stahlmandesign/8tw72bgy/10/), [Example in WP](https://www.wptricks.com/question/is-there-a-core-sortable-component-in-gutenberg/)

---

## TypeScript notes

-   Items, Item & Item Wrapper components use TypeScript generic declarations extending QueryItem & QueryItemBase accordingly. Reference examples of before & after here so that the reasoning for this setup is more clear:
    -   [Fixed](https://codesandbox.io/s/cocky-wind-isx5sk?file=/src/components.tsx:705-761)
    -   [Broken](https://codesandbox.io/s/distracted-volhard-3o4tb9?file=/src/components.tsx:1105-1161)
