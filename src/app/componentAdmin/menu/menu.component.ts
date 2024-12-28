import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { Router } from '@angular/router';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  constructor(private router: Router, private dialog: MatDialog) {
    this.dataSource.data = TREE_DATA;
  }
  hasChild = (_: number, node: FoodNode) =>
    !!node.children && node.children.length > 0;

  logout() {
    localStorage.removeItem('user_token');
    alert('Đăng xuất thành công');
    this.dialog.closeAll();
    this.router.navigate(['admin']);
  }
  onCancel(): void {
    this.dialog.closeAll();
  }
  openConfirmDialog(): void {
    this.dialog.open(this.confirmDialog);
  }
}
