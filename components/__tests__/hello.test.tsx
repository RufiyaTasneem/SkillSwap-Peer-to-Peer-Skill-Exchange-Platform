import React from 'react';
import { render, screen } from '@testing-library/react';
import Hello from '../Hello';

describe('Hello component', () => {
    test('renders hello message', () => {
        render(<Hello />);
        const linkElement = screen.getByText(/hello/i);
        expect(linkElement).toBeInTheDocument();
    });

    test('renders correct props', () => {
        render(<Hello name="World" />);
        const linkElement = screen.getByText(/hello world/i);
        expect(linkElement).toBeInTheDocument();
    });
});