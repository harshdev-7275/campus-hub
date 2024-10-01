-- CreateEnum
CREATE TYPE "COLLEGES" AS ENUM ('indian_institute_of_science_iisc', 'rv_college_of_engineering', 'pes_university', 'bms_college_of_engineering', 'ms_ramaiah_institute_of_technology', 'dayananda_sagar_college_of_engineering', 'new_horizon_college_of_engineering', 'bangalore_institute_of_technology', 'sir_m_visvesvaraya_institute_of_technology', 'st_johns_medical_college', 'bangalore_medical_college_and_research_institute', 'ms_ramaiah_medical_college', 'kempegowda_institute_of_medical_sciences', 'vydehi_institute_of_medical_sciences', 'indian_institute_of_management_bangalore', 'symbiosis_institute_of_business_management', 'christ_university', 'xavier_institute_of_management_and_entrepreneurship', 'acharya_institute_of_management_and_sciences', 'mount_carmel_college', 'st_josephs_college', 'jyoti_nivas_college', 'nmkrv_college_for_women', 'national_law_school_of_india_university', 'kle_societys_law_college', 'bangalore_institute_of_legal_studies');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "college" "COLLEGES",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "username" TEXT;
