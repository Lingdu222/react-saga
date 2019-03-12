import { Ipt } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

// 由于部分组件没法不支持rule，故暂时取此方案
class CheckWrapper extends Ipt.Base {
    static propTyeps = {
        iptType: PropTypes.string,
        readonly: PropTypes.bool
    }

    static defaultProps = {
        iptType: 'form',
        readonly: false
    }

    getValue() {
        return this.formRef && this.formRef.getValue();
    }

    setValue(data) {
        this.formRef.setValue(data);
    }

    checkData() {
        const { rule, iptType } = this.props;
        const data = this.getValue();
        if (iptType === 'form') {
            const isChecked = this.formRef.checkData();
            if (!isChecked) {
                return false;
            }
        }
        if (!_.toArray(rule).length) return true;

        for (let i = 0; i < rule.length; i += 1) {
            if (_.isFunction(rule[i])) {
                return rule[i](data);
            } if (rule[i] === 'required' && !data) {
                return {
                    msg: '必填项'
                };
            }
        }

        return true;
    }

    render() {
        const { iptType, ...other } = this.props;
        return (
            <Ipt
                {...other}
                type={iptType}
                ref={(ref) => { this.formRef = ref; }}
                readonly={this.props.readonly}
            />
        );
    }
}
Ipt.register('dbmpipt-check', CheckWrapper);
