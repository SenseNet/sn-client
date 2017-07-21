export const styles = {
    container: {
        position: 'relative',
        marginBottom: 45
    },
    ardpdatepicker: {
        fontSize: 16,
        fontFamily: 'Arial',
        boxSizing: 'border-box'
    },
    calendar: {
        position: 'absolute',
        zIndex: 10,
        background: 'white',
        width: 260,
        padding: 5,
        color: '#244152',
        borderRadius: 3,
        height: 203,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
    },
    calendarShow: {
        top: 'top',
        left: 'left',
        visibility: 'visible',
        opacity: 1,
        transition: 'opacity 100ms linear'
    },
    calendarHide: {
        visibility: 'hidden',
        opacity: 0,
        transition: 'visibility 0s 100ms, opacity 100ms linear'
    },
    monthHeader: {
        float: 'left',
        width: 100,
        display: 'flex',
        WebkitJustifyContent: 'space-between',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    monthHeaderI: {
        fontWeight: 'bold',
        padding: '5px 8px',
        borderRadius: 3,
        cursor: 'pointer',
        fontStyle: 'normal',
        fontSize: '0.7em',
        ':hover': {
            backgroundColor: '#026aa7',
            color: 'white'
        }
    },
    weekHeader: {
        float: 'left',
        width: '100%',
        marginTop: 8,
        display: 'table',
        paddingBottom: 3,
        borderBottom: 'solid 1px #CCC',
        marginBottom: 3
    },
    weekHeaderSpan: {
        float: 'left',
        width: '14.285714285714286%',
        fontSize: '0.6em',
        textTransform: 'uppercase',
        color: '#026aa7',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    weeks: {
        float: 'left',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        height: 140
    },
    weeksDivCurrent: {
        position: 'absolute',
        width: 250,
        left: 0
    },
    weeksDivOther: {
        position: 'absolute',
        width: 250,
        left: 250
    },
    weeksDivOtherRight: {
        position: 'absolute',
        width: 250,
        left: -250
    },
    weeksDivOtherSliding: {
        transition: 'transform 250ms ease',
        '-webkit-transition': '-webkit-transform 250ms ease'
    },
    weeksDivOtherSlidingLeft: {
        transition: 'translate3d(-250px, 0, 0)',
        '-webkit-transition': 'translate3d(-250px, 0, 0)'
    },
    weeksDivOtherSlidingRight: {
        transition: 'translate3d(250px, 0, 0)',
        '-webkit-transition': 'translate3d(250px, 0, 0)'
    },
    label: {
        color: '#999',
        fontSize: 18,
        fontWeight: 'normal',
        position: 'absolute',
        pointerEvents: 'none',
        left: 5,
        top: 10,
        transition: '0.2s ease all',
        MozTransition: '0.2s ease all',
        WebkitTransition: '0.2s ease all',
        ':hover': {
            color: 'magenta'
        }
    },
    input: {

    },
    error: {},
    hint: {},
    browse: {},
    percentage: {},
    required: {}
}