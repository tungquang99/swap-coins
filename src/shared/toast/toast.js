import { message } from 'antd';

export const toast = (status, content, duration = 1.5) => {
    switch (status) {
        case 'success':
            message.success(content, duration)
            break;
        case 'error':
            message.error(content, duration)
            break;
        case 'info':
            message.info(content, duration)
            break;
        case 'warning':
            message.warning(content, duration)
            break;
        case 'warn':
            message.warn(content, duration)
            break;
        case 'loading':
            message.loading(content, duration)
            break;
        default:
            break;
    }
}
