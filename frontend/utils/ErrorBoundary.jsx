import React, { Component } from 'react'


 class ErrorBoundary extends Component {

    constructor(props){
      console.log('constructorrrrrrrrr');
      super(props);
      this.state = {
        hasError : false
      };
    }

    static getDerivedStateFromError(error){
      console.log('ddsdsdsdsdsd');
    }

    componentDidCatch(error,info){
      this.setState({hasError:true})
      console.log(error);
      console.log(info);
    }

  render() {
    
      return <h1>Sorry Error Has Occured {JSON.stringify(this.state.hasError)}</h1>
  }
}

export default ErrorBoundary;
