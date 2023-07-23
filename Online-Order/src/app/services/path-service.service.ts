import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PathService{

  constructor() { }

    //Get Selected Path
    setPath(value : string)
    {
      localStorage.setItem('path',JSON.stringify(value));
    }
  
    //Returns selected Path
    getPath()
    {
      return JSON.parse(localStorage.getItem('path')!);
    }
  
    //Clears Path
    clearPath()
    {
      localStorage.removeItem('path');
    } 
     //

     
    //Get Selected Account
    setRequest(value : string)
    {
      localStorage.setItem('request',JSON.stringify(value));
    }
  
    getRequest()
    {
      return JSON.parse(localStorage.getItem('request')!);
  
    }
  
    clearRequest()
    {
      localStorage.removeItem('request');
    } 
}
