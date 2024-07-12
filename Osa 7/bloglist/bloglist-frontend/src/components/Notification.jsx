import { useSelector } from "react-redux";

const NotificationBar = () => {
    const info = useSelector((state) => state.notification);

    const notificationStyle = {
      color: info.success ? "green" : "red",
      background: "lightgrey",
      fontSize: 16,
      borderStyle: "solid",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    };
    if (info.text === null) {
      return null;
    }
    return <div style={notificationStyle}>{info.text}</div>;
  };

export default NotificationBar;