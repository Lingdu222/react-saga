import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

export default WrapComp => class extends PureComponent {
    static defaultProps = {
        loading: false
    }

    static propTypes = {
        loading: PropTypes.bool
    }

    render() {
        const { loading, ...others } = this.props;
        return (
            <Spin spinning={loading}>
                <WrapComp {...others} />
            </Spin>
        );
    }
};
