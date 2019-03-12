// var person=function(){
//     var age=18;
//     this.getage=function(){
//         return age
//     }
//     this.address="china"
// }
// var student=function(){}
// student.prototype=new person()
// console.log(student.address)//undefined
// var zhangs=new student()
// console.log(zhangs.getage())//18
import { Icon, Button, Input, AutoComplete } from 'antd';
const Option = AutoComplete.Option;

function getRandomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
}



function renderOption(item) {
  return (
    <Option key={item.category} text={item.category}>
      {item.query} 在
      <a
        href={`https://s.taobao.com/search?q=${item.query}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.category}
      </a>
      区块中
      <span className="global-search-item-count">约 {item.count} 个结果</span>
    </Option>
  );
}

function searchResult(query) {
  return (new Array(getRandomInt(5))).join('.').split('.')
    .map((item, idx) => ({
      query,
      category: `${query}${idx}`,
      // count: getRandomInt(200, 100),
    }));
}

class Complete extends React.Component {
  state = {
    dataSource: [],
  }

  handleSearch = (value) => {
    this.setState({
      dataSource: value ? searchResult(value) : [],
    });
  }

  render() {
    const { dataSource } = this.state;
    return (
      <div className="global-search-wrapper" style={{ width: 300 }}>
        <AutoComplete
          dataSource={dataSource.map(renderOption)}
          onSearch={this.handleSearch}
          optionLabelProp="text"
        >
        </AutoComplete>
      </div>
    );
  }
}

ReactDOM.render(<Complete />, mountNode);



{
  showNav && (!isExtra || (() => {
    return location.hash.search('#/extrapage') > -1
  })())
    && <div className={menuIconClsName} onClick={() => { this.showMenu() }}>
      <svg

        aria-hidden="true"
      >
        <use xlinkHref={"#fs-nav"} />
      </svg><span className="title">导航</span>
    </div>
}