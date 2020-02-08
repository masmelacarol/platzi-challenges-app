import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SEARCH } from '@graphql/queries';
import { SearchResponse, Filter } from '@models/repositoty.model';


@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  constructor(
    @Inject('API_URL') private apiUrl: string,
    private http: HttpClient
  ) { }

  search(filter: Partial<Filter>): Observable<SearchResponse> {
    let query = `org:PlatziMaster `;
    if (filter.topic && filter.topic !== 'all') {
      query += `topic:${filter.topic} `;
    }
    if (filter.language && filter.language !== 'all') {
      query += `language:${filter.language}`;
    }
    return this.http.post(this.apiUrl, {
      query: SEARCH,
      variables: { query }
    }, {
      headers: {
        Authorization: `Bearer e7b96ba86c46dd29309e8bcb8a81ef7c86e5551c`
      }
    })
    .pipe(
      map((response: any) => {
        const rta = response.data.search as SearchResponse;
        if (filter.type  && filter.type !== 'all') {
          rta.edges = rta.edges
          .filter(edge => edge.node.name.includes(filter.type));
        }
        rta.edges = rta.edges.map(edge => {
          const topics = edge.node.repositoryTopics.nodes
          .map(item => item.name);
          if (topics.includes('level-basic')) {
            edge.node.level = {
              name: 'basic',
              color: 'success'
            };
          } else if (topics.includes('level-medium')) {
            edge.node.level = {
              name: 'medium',
              color: 'warning'
            };
          } else if (topics.includes('level-hight')) {
            edge.node.level = {
              name: 'hight',
              color: 'danger'
            };
          }
          return edge;
        });
        return rta;
      })
    );

  }
}
