
import { useEffect } from 'react';
import { gapi } from 'gapi-script';
import { clientId } from '../constants/constants';
export const useAuthGoogle = () => {
    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scrope: ""
            })
        }

        gapi.load('client:auth2', start)
    }, [])
}