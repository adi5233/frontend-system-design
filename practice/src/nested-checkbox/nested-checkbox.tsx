import { useState } from "react";

type NestedCheckbox = {
  id: number;
  text: string;
  isChecked: boolean;
  isIndeterminate: boolean;
  children: NestedCheckbox[];
};

type CheckboxRowProps = {
  checkbox: NestedCheckbox;
  onCheckboxClick: (id: number, checked: boolean) => void;
};

const initialTree: NestedCheckbox = {
  id: 1,
  text: "test1",
  isChecked: false,
  isIndeterminate: false,
  children: [
    {
      id: 2,
      text: "test2",
      isChecked: false,
      isIndeterminate: false,
      children: [
        {
          id: 3,
          text: "test3",
          isChecked: false,
          isIndeterminate: false,
          children: [
            {
              id: 4,
              text: "test4",
              isChecked: false,
              isIndeterminate: false,
              children: [],
            },
          ],
        },
        {
          id: 5,
          text: "test5",
          isChecked: false,
          isIndeterminate: false,
          children: [],
        },
      ],
    },
    {
      id: 6,
      text: "test6",
      isChecked: false,
      isIndeterminate: false,
      children: [
        {
          id: 7,
          text: "test7",
          isChecked: false,
          isIndeterminate: false,
          children: [],
        },
      ],
    },
  ],
};

// Check/uncheck a node and all its descendants
const setChildrenChecked = (
  node: NestedCheckbox,
  checked: boolean,
): NestedCheckbox => ({
  ...node,
  isChecked: checked,
  isIndeterminate: false,
  children: node.children.map((child) => setChildrenChecked(child, checked)),
});

// Find the target node and update its ancestors
const updateTree = (
  node: NestedCheckbox,
  targetId: number,
  checked: boolean,
): NestedCheckbox => {
  if (node.id === targetId) {
    return setChildrenChecked(node, checked);
  }

  let targetFound = false;

  const updatedChildren = node.children.map((child) => {
    const updatedChild = updateTree(child, targetId, checked);

    if (updatedChild !== child) {
      targetFound = true;
    }

    return updatedChild;
  });

  // Don't change branches that don't contain the target
  if (!targetFound) {
    return node;
  }

  const allChildrenChecked =
    updatedChildren.length > 0 &&
    updatedChildren.every((child) => child.isChecked && !child.isIndeterminate);

  const someChildrenChecked = updatedChildren.some(
    (child) => child.isChecked || child.isIndeterminate,
  );

  return {
    ...node,
    children: updatedChildren,
    isChecked: allChildrenChecked,
    isIndeterminate: !allChildrenChecked && someChildrenChecked,
  };
};

export const NestedCheckboxes = () => {
  const [tree, setTree] = useState(initialTree);

  const handleCheckboxClick = (id: number, checked: boolean) => {
    setTree((previousTree) => updateTree(previousTree, id, checked));
  };

  return (
    <div className="w-[500px] min-h-[500px] bg-slate-300 p-5">
      <h1 className="text-center text-2xl font-sans mb-3">Nested Checkboxes</h1>

      <CheckboxRow checkbox={tree} onCheckboxClick={handleCheckboxClick} />
    </div>
  );
};

const CheckboxRow = ({ checkbox, onCheckboxClick }: CheckboxRowProps) => {
  const { id, text, children, isChecked, isIndeterminate } = checkbox;

  return (
    <div className="flex flex-col gap-2 ml-5">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isChecked}
          ref={(element) => {
            if (element) {
              element.indeterminate = isIndeterminate;
            }
          }}
          onChange={(event) => onCheckboxClick(id, event.target.checked)}
        />

        <span className="ml-2">{text}</span>
      </div>

      {children.map((child) => (
        <CheckboxRow
          key={child.id}
          checkbox={child}
          onCheckboxClick={onCheckboxClick}
        />
      ))}
    </div>
  );
};
