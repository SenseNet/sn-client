import * as React from 'react';
import Button from 'material-ui/Button';
import Add from 'material-ui-icons/Add';

const styles = {
    actionButton: {
        color: '#fff',
        position: 'fixed',
        bottom: 10,
        right: 10
    }
}

export const FloatingActionButton = () => (
    <Button fab color='accent' aria-label='add' style={styles.actionButton as any}>
        <Add />
    </Button>
)