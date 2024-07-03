import { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAccountService } from '../contexts/AccountService';

interface UseSocketReturn {
    setOnReceiveGroupMessage: (callback: (message: any) => void) => void;
    getConnectionStatus: () => boolean;
}

const useSocket = (): UseSocketReturn => {
    const Account = useAccountService();
    const url = Account.testMode ? 'http://10.0.60.12:5903/sys/NotificationHub' : "https://apidigital.flo.com.tr:443/sys/NotificationHub";

    const connection = useRef<signalR.HubConnection | null>(null);
    const whId = Account.getUserStoreWarehouseId();

    const [connectionStatus, setConnectionStatus] = useState<signalR.HubConnectionState>(signalR.HubConnectionState.Disconnected);

    useEffect(() => {
        const createConnection = () => {
            connection.current = new signalR.HubConnectionBuilder()
                .withUrl(url)
                .build();

            connection.current.onclose(() => {
                setTimeout(() => {
                    createConnection();
                    startConnection();
                }, 5000);
            });

            connection.current.on('ReceiveGroupMessage', (message) => {
                if (onReceiveGroupMessage.current) {
                    onReceiveGroupMessage.current(message);
                }
            });

            connection.current.onreconnecting(() => {
                setConnectionStatus(signalR.HubConnectionState.Reconnecting);
            });

            connection.current.onreconnected(() => {
                setConnectionStatus(signalR.HubConnectionState.Connected);
            });
        };

        const startConnection = async () => {
            try {
                await connection.current!.start();
                subscribeToGroup(); // Bağlantı başladığında bir kez çağrılmalı
                setConnectionStatus(signalR.HubConnectionState.Connected);
            } catch (err) {
                setConnectionStatus(signalR.HubConnectionState.Disconnected);
            }
        };

        const subscribeToGroup = async () => {
            if (whId) {
                try {
                    await connection.current!.invoke('SubscribeToGroup', whId?.toString());
                } catch (err) {
                }
            }
        };

        createConnection();
        startConnection();

        return () => {
            if (connection.current) {
                connection.current.stop().then(() => console.log('Connection stopped.'));
                setConnectionStatus(signalR.HubConnectionState.Disconnected);
            }
        };
    }, [whId]);

    const onReceiveGroupMessage = useRef<null | ((message: any) => void)>(null);
    const setOnReceiveGroupMessage = (callback: (message: any) => void) => {
        onReceiveGroupMessage.current = callback;
    };

    const getConnectionStatus = () => connectionStatus === signalR.HubConnectionState.Connected;

    return {
        setOnReceiveGroupMessage,
        getConnectionStatus,
    };
};

export default useSocket;
