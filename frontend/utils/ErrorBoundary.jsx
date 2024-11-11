import React, { Component } from 'react'
import {routerBoundary} from './routerBoundary'


 class ErrorBoundary extends Component {

    constructor(props){
      console.log(props);
      console.log('constructorrrrrrrrr');
      super(props);
      this.state = {
        hasError : false
      };
    }
 

    static getDerivedStateFromError(error){
      console.log('getDerivedStateFromError');
      return { hasError : true}
    }

    componentDidUpdate(prevState,CurrState){
      console.log('componentDidUpdate');
      console.log(prevState);
      console.log(CurrState);
    }

    componentDidCatch(error,info){
      console.log('componentDidCatch');
      console.log(error);
      console.log(info);
    }



  render() {
    console.log(this.state.hasError);
      if(this.state.hasError){
        return <h1>Sorry Error Has Occured {JSON.stringify(this.state.hasError)}</h1>
      }
      return this.props.children;
  }
}

export default routerBoundary(ErrorBoundary);
