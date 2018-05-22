/**
 * Created by Yu Tian Xiong on 2017/12/11.
 */
import React, {Component} from 'react';
import {Upload, Icon, message} from 'antd';
import "./InfoManagement.less";
import Token from "./../../basics/token"

class InfoManagement extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {

  }

  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  }
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  };
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  //自定义上传
  handleCustomRequest = (options, callback) => {
    Token.fetchAppToken().then(res => {
      if (typeof res === 'string') {
        callback(options.file, res);
      } else {
        let token = res.Data.Token;
        sessionStorage.setItem("AppToken", token);
        callback(options.file, token);
      }
    })
  };
  //上传封面
  handleUploadHeadPic = (file, token) => {
    const fd = new FormData();
    fd.append('filename', file);
    this.setState({uploadPicLoading: true});
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <div>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          //action="//jsonplaceholder.typicode.com/posts/"
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          customRequest={(options) => this.handleCustomRequest(options, (file, token) => this.handleUploadHeadPic(file, token))}
        >
          {imageUrl ? <img src={imageUrl} alt=""/> : uploadButton}
        </Upload>
      </div>
    )
  }
}

export default InfoManagement;