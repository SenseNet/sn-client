import Input from '@material-ui/core/Input'
import * as React from 'react'
import MediaQuery from 'react-responsive'

const styles = {
    textStyle: {
        width: 300,
        background: '#fff',
        borderRadius: 2,
        borderBottom: 0,
        boxShadow: '0px 2px 2px #3c9fbf',
    },
    openMobile: {
        width: '100%',
    },
    closed: {
        width: 0,
    },
    searchButton: {
        color: '#fff',
        verticalAlign: 'middle' as any,
    },
    icon: {
        width: 40,
        height: 40,
        padding: 5,
        top: 0,
        color: '#fff',
        verticalAlign: 'middle' as any,
    },
}

const quickSearchBox = ({ isOpen, onClick }) => {
    return (
        <MediaQuery minDeviceWidth={700}>
            {(matches) => {
                if (matches) {
                    return <div>
                        <Input name="search" style={styles.textStyle} disableUnderline={true} />
                    </div>
                } else {
                    return <Input name="search" placeholder="search" style={styles.textStyle} disableUnderline={true} />
                }
            }}

        </MediaQuery>
    )
}

export default quickSearchBox
