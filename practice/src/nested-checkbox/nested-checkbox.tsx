import { useState } from "react";
import { useTree } from "./use-tree";

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

export const NestedCheckboxes = () => {
  const [tree, setTree] = useState(initialTree);
  const { updateNode } = useTree();

  const handleCheckboxClick = (id: number, checked: boolean) => {
    setTree((previousTree) => updateNode(previousTree, id, checked));
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
