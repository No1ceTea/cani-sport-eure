import CatalogueSorties from '../components/CatalogueSorties';
import SidebarAdmin from '../components/SidebarAdmin';

export default function CataloguePage() {
    return (
      <div className="flex">
        <SidebarAdmin />
        <CatalogueSorties />
      </div>
    );
  }
  


