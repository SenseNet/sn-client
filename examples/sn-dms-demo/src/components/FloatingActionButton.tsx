import * as React from 'react';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

const styles = {
    actionButton: {
        color: '#fff',
        position: 'absolute',
        bottom: 10,
        right: 10
    }
}

export const FloatingActionButton = () => (
    <Button fab color='accent' aria-label='add' style={styles.actionButton}>
        <AddIcon />
    </Button>
)