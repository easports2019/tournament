import { useSelector } from "react-redux"

export const useIsConnected = () => {
    debugger
    let connected = useSelector(state => state.system.Connected)
    return connected;
    //const count = useSelector(state => state.counter.count)
  }