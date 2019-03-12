import React from 'react';
import PropTypes from 'prop-types';
import { Form, BtnGroup } from 'antd';

const defaultSearchConfig = {
    btns: ['search', 'reset'],
    layout: { column: 3 },
    fields: {},
    defaultData: {}
};
export default class SearchPanel extends React.Component {
    static defaultProps = {
        searchCfg: defaultSearchConfig,
        onSearch: () => { },
        onReset: () => { }
    }

    static propTypes = {
        searchCfg: PropTypes.object,
        onSearch: PropTypes.func,
        onReset: PropTypes.func
    }

    getCfg = () => {
        const { searchCfg } = this.props;
        return _.merge(
            {},
            defaultSearchConfig,
            searchCfg,
            {
                fields: _.mapKeys(
                    searchCfg.fields,
                    (item, key) => item.key || key
                )
            }
        );
    }

    getData() {
        return this.formRef && this.formRef.getData();
    }

    setData(data) {
        this.formRef.setData(data);
    }

    getBtnMap = () => {
        const { onSearch, onReset } = this.props;

        return {
            search: {
                color: 'primary',
                title: '搜索',
                onClick() {
                    onSearch();
                }
            },
            reset: {
                title: '重置',
                onClick: () => {
                    this.reset();
                    this.setState({}, () => {
                        onReset();
                    });
                }
            }
        };
    }

    reset = () => {
        this.formRef.reset();
    }

    render() {
        const searchCfg = this.getCfg();
        return (
            <div className="dbmp-searchlist-search">
                <Form
                    configKey="search"
                    defaultType={false}
                    disabledType="tabs"
                    {...searchCfg}
                    ref={(ref) => { this.formRef = ref; }}
                    btns={false}
                />
                <div className="dbmp-searchlist-search-btns clearfix">
                    <BtnGroup
                        btns={searchCfg.btns}
                        btnMap={this.getBtnMap()}
                    />
                </div>
            </div>
        );
    }
}
