import * as React from 'react'
import IconButton from 'material-ui/IconButton';
import * as SearchIcon from 'material-ui-icons/Search';
import TextField from 'material-ui/TextField'

const styles = {
    open: {
        width: 300,
    },
    closed: {
        width: 0,
    },
    searchButton: {
        color: '#fff',
        verticalAlign: 'middle'
    },
    icon: {
        width: 40,
        height: 40,
        padding: 5,
        top: 0,
        color: '#fff',
        verticalAlign: 'middle'
    }
}

const QuickSearchBox = ({ isOpen, onClick, additionalStyles }) => {
    let textStyle = isOpen ? styles.open : styles.closed;
    textStyle = Object.assign(textStyle, additionalStyles ? additionalStyles.text : {}, { color: '#fff' });
    return (
        <div>
            <TextField name='search' style={textStyle} />
            <IconButton
                style={styles.icon}
                aria-label='Search'
                onClick={() => onClick()}>
                <SearchIcon />
            </IconButton>
        </div>
    )
}

export default QuickSearchBox