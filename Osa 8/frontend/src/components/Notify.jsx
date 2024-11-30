import PropTypes from 'prop-types';

const Notify = ({infoMessage, isError}) => {
    if ( !infoMessage ) {
      return null
    }
    return (
      <div 
        style={{
          color: isError ? 'red':'green', 
          paddingTop: 10, 
          paddingBottom: 10,
        }}
      >
        {infoMessage}
      </div>
    )
}

Notify.propTypes = {
    infoMessage: PropTypes.string,
    isError: PropTypes.bool
};

export default Notify