import React from "react";
import ReactDOM from "react-dom";
import "./App.css";

interface AppProps { }

interface AppState {
  a: number;
  b: number;
}

class App extends React.Component<AppProps, AppState> {
  btn: HTMLElement | null = null;
  forceBtn: HTMLElement | null = null;
  constructor(props: AppProps) {
    super(props);
    this.state = {
      a: 0,
      b: 0,
    };
  }
  componentDidMount() {
    // 批量执行 setState()
    this.setState({
      a: 1,
    });
    console.log("componentDidMount  a  ", this.state.a);

    this.btn = document.getElementById("btn");
    // false 冒泡阶段触发 document，true 捕获阶段触发 document
    this.btn?.addEventListener("click", this.changeState, false);

    this.forceBtn = document.getElementById("force-batch");
    this.forceBtn?.addEventListener("click", this.batchChange, false);

    document.addEventListener("click", this.logState, false);

    setTimeout(() => {
      ReactDOM.unstable_batchedUpdates(() => {
        // 强制批量执行
        this.setState({
          a: 1000,
        });
        console.log("setTimeout force batch a ", this.state.a);
      });

      this.setState({
        a: 3000,
      });
      // setTimeout 回调中不批量执行，输出 3000
      console.log("setTimeout  a ", this.state.a);
    }, 3000);

    Promise.resolve().then(() => {
      this.setState({
        a: 500,
      });
      // then 回调中不批量执行，输出 500
      console.log("then  a ", this.state.a);
    });
  }
  componentWillUnmount() {
    this.btn?.removeEventListener("click", this.changeState, false);
    this.forceBtn?.removeEventListener("click", this.batchChange, false);
    document.removeEventListener("click", this.logState, false);
  }

  // React 事件处理函数，批量执行
  handleClick = () => {
    this.setState({
      a: 2,
    });
    console.log("handleClick a   ", this.state.a);
  };


  changeState = () => {
    this.setState({
      a: 20,
    });
    // 原生事件处理函数，非批量执行，输出 20
    console.log("click btn  a ", this.state.a);
  };

  // 强制批量执行
  batchChange = () => {
    ReactDOM.unstable_batchedUpdates(() => {
      this.setState({
        a: 30,
      });
      console.log("force-batch  a ", this.state.a);
    });
  };

  logState = () => {
    console.log("click document  a ", this.state.a);
  };

  render() {
    return (
      <div className="App">
        <button onClick={this.handleClick}>批量执行</button>
        <button id="btn">非批量执行</button>
        <button id="force-batch">强制批量执行</button>
      </div>
    );
  }
}

export default App;
