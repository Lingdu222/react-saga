import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'nova';

export default class SearchTable extends React.Component {
    static propTypes = {
        tableCfg: PropTypes.object,
        getSearchData: PropTypes.func
    }

    static defaultProps = {
        tableCfg: {},
        getSearchData: () => { }
    }

    getColumn = () => {
        const { tableCfg } = this.props;

        return _.map(tableCfg.columns, (cfg, index) => {
            if (_.isString(cfg)) {
                return {
                    align: 'center',
                    key: index,
                    dataIndex: index,
                    title: cfg
                };
            }
            const key = cfg.key || index;

            return {
                ...cfg,
                align: 'center',
                dataIndex: cfg.dataIndex || key,
                key
            };
        });
    }

    getSource = () => {
        const { tableCfg, getSearchData } = this.props;

        return () => {
            const data = getSearchData();
            const params = {};

            _.mapValues(data, (value, key) => {
                if (typeof value === 'undefined' || value === '') {
                    // 忽略未设置值的选项
                    return;
                }
                params[key] = value;
            });

            let source = {
                url: 'iGetListData',
                data: params
            };

            if (_.get(tableCfg, 'source')) {
                source = tableCfg.source(source);
            }

            return source;
        };
    }

    refresh() {
        this.tableRef.refresh(true);
    }

    render() {
        const { tableCfg } = this.props;
        return (
            <div className="dbmp-searchlist-table">
                <Table
                    {...tableCfg}
                    header={tableCfg.header || false}
                    columns={this.getColumn()}
                    source={this.getSource()}
                    ref={(ref) => { this.tableRef = ref; }}
                    pager={{
                        showQuickJumper: true,
                        showTotal: total => (
                            <p>
                                共
                                <span>{total}</span>
                                条数据
                            </p>
                        )
                    }}
                />
            </div>
        );
    }
}
