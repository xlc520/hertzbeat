import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Message } from '../pojo/Message';
import { Monitor } from '../pojo/Monitor';
import { Page } from '../pojo/Page';

const monitor_uri = '/monitor';
const monitors_uri = '/monitors';
const detect_monitor_uri = '/monitor/detect';
const manage_monitors_uri = '/monitors/manage';
const summary_uri = '/summary';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {
  constructor(private http: HttpClient) {}

  public newMonitor(body: any): Observable<Message<any>> {
    return this.http.post<Message<any>>(monitor_uri, body);
  }

  public editMonitor(body: any): Observable<Message<any>> {
    return this.http.put<Message<any>>(monitor_uri, body);
  }

  public deleteMonitor(monitorId: number): Observable<Message<any>> {
    return this.http.delete<Message<any>>(`${monitor_uri}/${monitorId}`);
  }

  public deleteMonitors(monitorIds: Set<number>): Observable<Message<any>> {
    let httpParams = new HttpParams();
    monitorIds.forEach(monitorId => {
      // 注意HttpParams是不可变对象 需要保存append后返回的对象为最新对象
      // append方法可以叠加同一key, set方法会把key之前的值覆盖只留一个key-value
      httpParams = httpParams.append('ids', monitorId);
    });
    const options = { params: httpParams };
    return this.http.delete<Message<any>>(monitors_uri, options);
  }

  public cancelManageMonitors(monitorIds: Set<number>): Observable<Message<any>> {
    let httpParams = new HttpParams();
    monitorIds.forEach(monitorId => {
      // 注意HttpParams是不可变对象 需要保存append后返回的对象为最新对象
      // append方法可以叠加同一key, set方法会把key之前的值覆盖只留一个key-value
      httpParams = httpParams.append('ids', monitorId);
    });
    const options = { params: httpParams };
    return this.http.delete<Message<any>>(manage_monitors_uri, options);
  }

  public enableManageMonitors(monitorIds: Set<number>): Observable<Message<any>> {
    let httpParams = new HttpParams();
    monitorIds.forEach(monitorId => {
      httpParams = httpParams.append('ids', monitorId);
    });
    const options = { params: httpParams };
    return this.http.get<Message<any>>(manage_monitors_uri, options);
  }

  public detectMonitor(body: any): Observable<Message<any>> {
    return this.http.post<Message<any>>(detect_monitor_uri, body);
  }

  public getMonitor(monitorId: number): Observable<Message<any>> {
    return this.http.get<Message<any>>(`${monitor_uri}/${monitorId}`);
  }

  public getMonitorsByApp(app: string): Observable<Message<Monitor[]>> {
    return this.http.get<Message<Monitor[]>>(`${monitors_uri}/${app}`);
  }

  public getMonitors(app: string, pageIndex: number, pageSize: number): Observable<Message<Page<Monitor>>> {
    app = app.trim();
    pageIndex = pageIndex ? pageIndex : 0;
    pageSize = pageSize ? pageSize : 8;
    // 注意HttpParams是不可变对象 需要保存set后返回的对象为最新对象
    let httpParams = new HttpParams();
    httpParams = httpParams.appendAll({
      app: app,
      pageIndex: pageIndex,
      pageSize: pageSize
    });
    const options = { params: httpParams };
    return this.http.get<Message<Page<Monitor>>>(monitors_uri, options);
  }

  public searchMonitors(monitorName: string, monitorHost: string, pageIndex: number, pageSize: number): Observable<Message<Page<Monitor>>> {
    pageIndex = pageIndex ? pageIndex : 0;
    pageSize = pageSize ? pageSize : 8;
    // 注意HttpParams是不可变对象 需要保存set后返回的对象为最新对象
    let httpParams = new HttpParams();
    httpParams = httpParams.appendAll({
      name: monitorName,
      host: monitorHost,
      pageIndex: pageIndex,
      pageSize: pageSize
    });
    const options = { params: httpParams };
    return this.http.get<Message<Page<Monitor>>>(monitors_uri, options);
  }

  public getMonitorMetricsData(monitorId: number, metrics: string): Observable<Message<any>> {
    return this.http.get<Message<any>>(`/monitor/${monitorId}/metrics/${metrics}`);
  }

  public getMonitorMetricHistoryData(
    monitorId: number,
    app: string,
    metrics: string,
    metric: string,
    history: string,
    interval: boolean
  ): Observable<Message<any>> {
    let metricFull = `${app}.${metrics}.${metric}`;
    let httpParams = new HttpParams();
    httpParams = httpParams.appendAll({
      history: history,
      interval: interval
    });
    const options = { params: httpParams };
    return this.http.get<Message<any>>(`/monitor/${monitorId}/metric/${metricFull}`, options);
  }

  public getAppsMonitorSummary(): Observable<Message<any>> {
    return this.http.get<Message<any>>(summary_uri);
  }
}
