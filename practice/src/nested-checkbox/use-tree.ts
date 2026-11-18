export type TreeNode<TExtra = unknown> = TExtra & {
  id: number;
  isChecked: boolean;
  isIndeterminate: boolean;
  children: TreeNode<TExtra>[];
};

// Check/uncheck a node and all its descendants
const updateChildren = <TExtra>(
  node: TreeNode<TExtra>,
  checked: boolean,
): TreeNode<TExtra> => ({
  ...node,
  isChecked: checked,
  isIndeterminate: false,
  children: node.children.map((child) => updateChildren(child, checked)),
});

// Find the target node and update its ancestors
const updateNode = <TExtra>(
  node: TreeNode<TExtra>,
  targetId: number,
  checked: boolean,
): TreeNode<TExtra> => {
  if (node.id === targetId) {
    return updateChildren(node, checked);
  }

  let nodeFound = false;

  const updatedChildren = node.children.map((child) => {
    const updatedChild = updateNode(child, targetId, checked);

    if (updatedChild !== child) {
      nodeFound = true;
    }

    return updatedChild;
  });

  // Don't change branches that don't contain the target
  if (!nodeFound) return node;

  const allChecked =
    updatedChildren.length > 0 &&
    updatedChildren.every((child) => child.isChecked && !child.isIndeterminate);

  const someChecked = updatedChildren.some(
    (child) => child.isChecked || child.isIndeterminate,
  );

  return {
    ...node,
    children: updatedChildren,
    isChecked: allChecked,
    isIndeterminate: !allChecked && someChecked,
  };
};

export const useTree = () => ({ updateNode });
