import * as React from 'react'
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui-icons/Search';
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
    },
    animationStyle : {
        transition: 'width 0.75s cubic-bezier(0.000, 0.795, 0.000, 1.000)'
    }
}

const QuickSearchBox = ({ isOpen, onClick }) => {
    let textStyle = isOpen ? styles.open : styles.closed;
    let additionalStyles = {text: styles.animationStyle, frame: styles.animationStyle}
    textStyle = { ...textStyle, ...additionalStyles } as any;
    return (
        <div>
            <TextField name='search' style={textStyle} />
            <IconButton
                style={styles.icon}
                aria-label='Search'
                onClick={() => onClick()}>
                <Search />
            </IconButton>
        </div>
    )
}

export default QuickSearchBox