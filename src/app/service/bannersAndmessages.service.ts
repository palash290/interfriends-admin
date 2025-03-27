import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'



const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class bannersAndmessagesService {



  constructor(private http: HttpClient, private router: Router) {}

  addbannersAndmessages(
   data : any
  ): any {
    const userData = new FormData();

    const multipleBanner = data.banner;
    console.log(multipleBanner)
    if(multipleBanner != undefined ){
      for (const key in Object.keys(multipleBanner)) {
        // console.log(multipleBanner[key], "PPPooooooooooooooooooP************")
        userData.append("image[]", multipleBanner[key]);
      }
    }

    userData.append('title', data.title);

    return this.http.post<{
      success: string;
      message: string;
      banners : any
    }>(
        API_URL + '/addBanner', userData
      );
  }


  editbannersAndmessages(
    id :any,
    data : any
   ): any {
     const userData = new FormData();

     /*const multipleBanner = data.banner;
     console.log(multipleBanner)
     if(multipleBanner != undefined ){
       for (const key in Object.keys(multipleBanner)) {
         // console.log(multipleBanner[key], "PPPooooooooooooooooooP************")
         userData.append("image[]", multipleBanner[key]);
       }
     }*/
     userData.append("image", data.banner[0]);
     userData.append('id', id);
     userData.append('title', data.title);

     return this.http.post<{
       success: string;
       message: string;
       banners : any
     }>(
         API_URL + '/editBanner', userData
       );
   }

  getAllbannersMessages(){
    return this.http.get<{
      success: string;
      message: string;
      banners : any
    }>(
        API_URL + '/allBanners'
      );
  }

  bannerDelete(id : any){

    const userData = new FormData();
    userData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/delete_banner', userData
      );
  }

}
