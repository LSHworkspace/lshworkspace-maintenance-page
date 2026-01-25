import React from 'react';
import { BackgroundStars } from './components/BackgroundStars';
import { ShootingStars } from './components/ShootingStars';
import { MaintenanceMessage } from './components/MaintenanceMessage';
import { Footer } from './components/Footer';

const App: React.FC = () => {
    return (
        <div className="relative w-full h-full">
            <BackgroundStars />
            <ShootingStars />
            <MaintenanceMessage />
            <Footer />
        </div>
    );
}

export default App;
