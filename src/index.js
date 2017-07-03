import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import axios from "axios";
import { CSSTransitionGroup } from "react-transition-group";

const Filter = ({ selected, changeSelected }) => {
  return (
    <div className="row">
      <div className="form-check col-4">
        <label className="form-check-label text-primary">
          <input
            type="radio"
            className="form-check-input"
            name="radio"
            id="streaming"
            value="streaming"
            onChange={changeSelected}
            checked={selected === "streaming"}
          />Online
        </label>
      </div>
      <div className="form-check col-4">
        <label className="form-check-label text-danger">
          <input
            onChange={changeSelected}
            type="radio"
            className="form-check-input"
            name="radio"
            id="offline"
            value="offline"
            checked={selected === "offline"}
          />Offline
        </label>
      </div>
      <div className="form-check col-4">
        <label className="form-check-label">
          <input
            type="radio"
            className="form-check-input"
            name="radio"
            value="all"
            id="all"
            onChange={changeSelected}
            checked={selected === "all"}
          />All
        </label>
      </div>
    </div>
  );
};

const ChannelList = ({ channels }) => {
  const lis = channels.map(channel =>
    <li key={channel.name} className="list-group-item">
      <img
        height="40"
        width="40"
        src={channel.logo}
        alt="logo"
        className="logo"
      />
      <a
        className="name"
        href={"https://twitch.tv/" + channel.name}
        target="_blank"
      >
        {channel.name}
      </a>
      <span
        className={
          channel.online ? "content text-success" : "content text-danger"
        }
      >
        {channel.content}
      </span>
    </li>
  );
  return (
    <ul className="list-group">
      <CSSTransitionGroup
        transitionName="list-transition"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={200}
        transitionLeave={false}
      >
        {lis}
      </CSSTransitionGroup>
    </ul>
  );
};

class App extends React.Component {
  state = {
    channels: [],
    selectedChannels: [],
    selected: "all",
    url: "https://wind-bow.glitch.me/twitch-api/streams/",
    channelsNames: [
      "ESL_SC2",
      "OgamingSC2",
      "cretetion",
      "freecodecamp",
      "storbeck",
      "habathcx",
      "RobotCaleb",
      "noobs2ninjas",
      "ogamingtv",
      "brunofin",
      "comster404"
    ]
  };
  componentWillMount() {
    this.state.channelsNames.forEach(name => {
      let channel = {};
      let channels = this.state.channels;
      axios.get(this.state.url + name).then(response => {
        const stream = response.data.stream;
        channel = {
          name: name,
          logo: stream
            ? stream.channel.logo
            : "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=NOLOGO",
          online: stream ? true : false,
          content: stream ? stream.channel.status : "OFFLINE"
        };
        channel.online ? channels.unshift(channel) : channels.push(channel);
        this.setState({ channels: channels, selectedChannels: channels });
      });
    });
  }
  selectChannels(e) {
    let channels = this.state.channels;
    let newArray = [];
    switch (e.target.value) {
      case "streaming":
        newArray = channels.filter(channel => channel.online && channel);
        this.setState({ selectedChannels: newArray, selected: e.target.value });
        break;
      case "offline":
        newArray = channels.filter(channel => !channel.online && channel);
        this.setState({ selectedChannels: newArray, selected: e.target.value });
        break;
      default:
        this.setState({ selectedChannels: channels, selected: e.target.value });
        break;
    }
  }
  render() {
    return (
      <div className="container mt-2">
        <div className="row justify-content-md-center">
          <div className="col-md-8 col-sm-12">
            <div className="display-1 text-center mb-2" id="title">
              Twitch Channels
            </div>
            <Filter
              selected={this.state.selected}
              changeSelected={e => this.selectChannels(e)}
            />
            <ChannelList channels={this.state.selectedChannels} />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
