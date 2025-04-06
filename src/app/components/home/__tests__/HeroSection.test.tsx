/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroSection from '../HeroSection';

// Mock the next/image component with proper attribute handling
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // Convert boolean attributes to strings for HTML compatibility
        const imgProps = { ...props };
        if (typeof imgProps.fill === 'boolean') {
            imgProps.fill = imgProps.fill.toString();
        }
        if (typeof imgProps.priority === 'boolean') {
            imgProps.priority = imgProps.priority.toString();
        }

        return <img {...imgProps} />;
    },
}));

describe('HeroSection', () => {
    it('renders the main heading', () => {
        render(<HeroSection />);

        const heading = screen.getByRole('heading', {
            level: 1,
            name: /discover our world's news, history, and mysteries/i,
        });

        expect(heading).toBeInTheDocument();
    });

    it('renders explore maps button', () => {
        render(<HeroSection />);

        const button = screen.getByRole('link', { name: /explore maps/i });

        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('href', '/maps');
    });

    it('renders read our blogs button', () => {
        render(<HeroSection />);

        const button = screen.getByRole('link', { name: /read our blogs/i });

        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('href', '/blogs/news');
    });
}); 