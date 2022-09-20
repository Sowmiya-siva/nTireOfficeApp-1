import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkflowApprovalPage } from './workflow-approval.page';

const routes: Routes = [
  {
    path: '',
    component: WorkflowApprovalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkflowApprovalPageRoutingModule {}
