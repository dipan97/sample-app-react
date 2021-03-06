import React, {Component} from 'react';
import PropTypes from 'prop-types';

import MessageTable from './components/MessageTable';

/**
 * This component renders a list of messages using the `MessageTable` component
 */
class MessageList extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object),
    folder: PropTypes.shape({
      columns: PropTypes.arrayOf(PropTypes.string)
    }),
  }

  render () {
    let {folder, messages} = this.props;
    return (
      <div className="messagelist">
        <div className="messages">
          <MessageTable columns={folder.columns} messages={messages} />
        </div>
      </div>
    );
  }
}

export default MessageList;
