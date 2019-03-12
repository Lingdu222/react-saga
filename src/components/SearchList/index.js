import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchPanel from './searchPanel';
import SearchTable from './searchTable';
import './style.less';

export default class SearchList extends Component {
    static propTypes = {
        className: PropTypes.string,
        searchCfg: PropTypes.object,
        tableCfg: PropTypes.object,
        beforeSearch: PropTypes.any
    }

    static defaultProps = {
        className: '',
        searchCfg: {},
        tableCfg: {},
        beforeSearch: false
    }

    curSearchCfg = {}

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchCfg !== this.curSearchCfg) {
            this.curSearchCfg = nextProps.searchCfg;
            const formData = this.getSearchData();
            const data = Object.assign({}, formData, nextProps.searchCfg.defaultData);
            this.searchRef.setData(data);
        }
    }

    // 获取搜索详情
    getSearchData = () => {
        const { beforeSearch } = this.props;
        let data = this.searchRef.getData() || {};
        if (beforeSearch) {
            data = beforeSearch(data);
        }
        return data;
    }

    // 刷新&重新查询表格
    refresh = () => {
        this.tableRef.refresh();
    }

    render() {
        const {
            searchCfg, tableCfg, className
        } = this.props;
        return (
            <div className={`dbmp-searchlist ${className}`}>
                {searchCfg && (
                    <SearchPanel
                        onSearch={this.refresh}
                        onReset={this.refresh}
                        ref={(ref) => { this.searchRef = ref; }}
                        searchCfg={searchCfg}
                    />
                )}
                {tableCfg && (
                    <SearchTable
                        getSearchData={this.getSearchData}
                        ref={(ref) => { this.tableRef = ref; }}
                        tableCfg={tableCfg}
                    />
                )}
            </div>
        );
    }
}
