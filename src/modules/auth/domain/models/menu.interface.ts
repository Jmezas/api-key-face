export interface DataItem {
  id: number;
  name: string;
  code_menu?: number;
  path: string;
  order: string;
  icon: string;
  type: string;
}

export interface TreeNode {
  id: number;
  title: string;
  children?: TreeNode[];
  path?: string;
  order: string;
  icon: string;
  type: string;
}
