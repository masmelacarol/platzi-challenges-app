import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';

import { GraphqlService } from '@services/graphql.service';
import { SearchResponse, Filter } from '@models/repositoty.model';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  response: SearchResponse = null;
  filter: Filter = {
    type: 'all',
    topic: 'all',
    language: 'all',
    level: 'all'
  };

  constructor(
    private graphqlService: GraphqlService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getRepositories(this.filter);
  }

  async getRepositories(filter: Partial<Filter>) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
    });
    await loading.present();
    this.graphqlService.search(filter)
    .subscribe(async (data) => {
      this.response = data;
      await loading.dismiss();
    }, async (error) => {
      await loading.dismiss();
    });
  }

  async openFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterModalComponent,
      componentProps: {
        payload: this.filter
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if ( data ) {
      this.filter = data;
      this.getRepositories(data);
    }
  }

}
