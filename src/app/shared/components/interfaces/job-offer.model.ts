import { agency } from './agency.model';
import { company } from './company.models';

export type polandcontacttype = 'Umowa o pracę' | 'Umowa zlecenie' | 'Umowa o dzieło' | 'B2B';
export type PolandContractType = polandcontacttype;

export interface joboffer {
    id: string;
    title: string;
    company: company;
    description: string;
    requirements: string[];
    agency?: agency;
    salary: number;
    location: string;
    contractType: polandcontacttype;
    requiresPolish: boolean;
    requiresEnglish: boolean;
    posteddate: Date;
}
export type JobOffer = joboffer;