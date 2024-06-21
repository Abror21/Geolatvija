<?php

namespace App\Services;


use App\Repositories\ClassifierValueRepository;
use App\Repositories\SystemSettingRepository;
use App\Services\API\GeoNetworkAPI;
use App\Traits\CommonHelper;
use Carbon\Carbon;
use DOMDocument;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use SimpleXMLElement;

/**
 * Class MetadataService
 * @package App\Services
 */
class MetadataService extends BaseService
{
    use CommonHelper;

    public function __construct
    (
        private GeoNetworkAPI $geoNetworkAPI,
        private ClassifierValueRepository $classifierValueRepository,
        private SystemSettingRepository $systemSettingRepository
    )
    {
    }


    public function checkMetadataResponse($id)
    {
        $jar = new CookieJar;
        return $this->geoNetworkAPI->call('/geonetwork/srv/api/records/' . $id . '/validate/inspire', [], 'GET', ['Accept' => 'application/json'], ['cookie_jar' => $jar]);
    }

    public function createMetadata($geoProduct, $geoProductService = null, $parentUuid = null)
    {
        // Create the root element
        $metadata = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?>
    <gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd"
                     xmlns:geonet="http://www.fao.org/geonetwork"
                     xmlns:gmx="http://www.isotc211.org/2005/gmx"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xlink="http://www.w3.org/1999/xlink"
                     xmlns:srv="http://www.isotc211.org/2005/srv"
                     xsi:schemaLocation="http://www.isotc211.org/2005/gmd http://schemas.opengis.net/csw/2.0.2/profiles/apiso/1.0.0/apiso.xsd">
    </gmd:MD_Metadata>');

        if ($parentUuid) {
            $this->xmlMainElements($metadata, 'service', $geoProductService->metadata_uuid);
        } else {
            $this->xmlMainElements($metadata, 'dataset', $geoProduct->metadata_uuid);
        }

        // Add contact element
        $responsibleParty = $metadata->addChild('gmd:contact')->addChild('gmd:CI_ResponsibleParty');
        $this->xmlContact($responsibleParty, $geoProduct->email, $geoProduct->organization_name);

        $metadata->addChild('gmd:dateStamp')->addChild('gco:Date', Carbon::now()->format('Y-m-d'), 'http://www.isotc211.org/2005/gco');

        $code = $this->getClassifierValue($geoProduct->coordinate_system_classifier_value_id);
        $this->xmlReferenceSystemInfo($metadata, $code);

        $identificationInfo = $metadata->addChild('gmd:identificationInfo');

        if ($parentUuid) {
            $this->xmlServiceIdentification($identificationInfo, $geoProduct, $geoProductService, $parentUuid);
        } else {
            $this->xmlDataIdentification($identificationInfo, $geoProduct);
        }

        // Add distributionInfo
        $distributionInfo = $metadata->addChild('gmd:distributionInfo');
        $distributor = $distributionInfo->addChild('gmd:MD_Distribution');

//        if ($parentUuid) {
//            $format = $distributor->addChild('gmd:distributionFormat')->addChild('gmd:MD_Format');
//            if ($geoProductService->file_format_classifier_value_id) {
//                $code = $this->getClassifierValue($geoProductService->file_format_classifier_value_id);
//                $format->addChild('gmd:name')->addChild('gco:CharacterString', $code, 'http://www.isotc211.org/2005/gco');
//                $format->addChild('gmd:version')->addChild('gco:CharacterString', $geoProductService->file_format_version ?? '', 'http://www.isotc211.org/2005/gco');
//            }
//        } else {
//            $geoProductFiles = $geoProduct->geoProductFiles;
//            foreach ($geoProductFiles as $geoProductFile) {
//                if ($geoProductFile->file_format_classifier_value_id) {
//                    $code = $this->getClassifierValue($geoProductFile->file_format_classifier_value_id);
//                    $format = $distributor->addChild('gmd:distributionFormat')->addChild('gmd:MD_Format');
//                    $format->addChild('gmd:name')->addChild('gco:CharacterString', $code, 'http://www.isotc211.org/2005/gco');
//                    $format->addChild('gmd:version')->addChild('gco:CharacterString', $geoProductFile->file_format_version ?? '', 'http://www.isotc211.org/2005/gco');
//                }
//            }
//        }

        $format = $distributor->addChild('gmd:distributionFormat')->addChild('gmd:MD_Format');
        if (!$parentUuid) {
            $format->addChild('gmd:name')->addChild('gco:CharacterString', 'onLine', 'http://www.isotc211.org/2005/gco');
            $format->addChild('gmd:version')->addChild('gco:CharacterString', '1.0', 'http://www.isotc211.org/2005/gco');
        }

        if ($parentUuid) {
            //sites are for other DIV
            $sites = $geoProductService->sites;
            if ($sites) {
                foreach ($sites as $site) {
                    $this->xmlTransferOptions($distributor, $site->site, 'information');
                }
            } else {
                $url = $geoProductService->dpps_link;
                if ($geoProductService->license_type->value !== 'OPEN') {
                    $url = config('geo.base_frontend_uri') . '/main?geoProductId=' . $geoProduct->id;
                }

                $this->xmlTransferOptions($distributor, $url, 'information');
            }
        } else {
            $geoProductServices = $geoProduct->geoProductServices;

            foreach ($geoProductServices as $geoProductService) {
                $code = $this->getClassifierValue($geoProductService->service_type_classifier_value_id);
                $type = '';
                switch ($code) {
                    case 'WFS':
                    case 'FEATURE_DOWNLOAD':
                        $type = 'download';
                        break;
                    case 'WMS':
                    case 'INSPIRE_VIEW':
                        $type = 'information';
                        break;
                }

                if ($type) {
                    $url = $geoProductService->dpps_link;

                    if ($code === 'FEATURE_DOWNLOAD') {
                        $url = $geoProductService->service_link;
                    }

                    if ($geoProductService->license_type->value !== 'OPEN') {
                        $url = config('geo.base_frontend_uri') . '/main?geoProductId=' . $geoProduct->id;
                    }

                    $this->xmlTransferOptions($distributor, $url, $type);
                }
            }

            //sites are for other DIV
            $others = $geoProduct->geoProductOthers;
            if ($others) {
                foreach ($others as $other) {
                    $sites = $other->sites;
                    if ($sites) {
                        foreach ($sites as $site) {
                            $this->xmlTransferOptions($distributor, $site->site, 'information');
                        }
                    }
                }
            }

            $files = $geoProduct->geoProductFiles;
            if ($files->count()) {
                $this->xmlTransferOptions($distributor, config('geo.base_frontend_uri') . '/main?geoProductId=' . $geoProduct->id, 'download');
            }
        }

        // Add dataQualityInfo
        $dataQuality = $metadata->addChild('gmd:dataQualityInfo')->addChild('gmd:DQ_DataQuality');

        $dqScope = $dataQuality->addChild('gmd:scope')->addChild('gmd:DQ_Scope');
        $scopeCode = $dqScope->addChild('gmd:level')->addChild('gmd:MD_ScopeCode', $parentUuid ? 'service' : 'dataset');
        $scopeCode->addAttribute('codeList', 'https://standards.iso.org/iso/19139/resources/gmxCodelists.xml#MD_ScopeCode');
        $scopeCode->addAttribute('codeListValue', $parentUuid ? 'service' : 'dataset');

        $dqScope->addChild('gmd:levelDescription')->addChild('gmd:MD_ScopeDescription')->addChild('gmd:other')
            ->addChild('gco:CharacterString', 'dataset', 'http://www.isotc211.org/2005/gco');

        $name = $this->systemSettingRepository->findBy('key', 'specification_name');
        $date = $this->systemSettingRepository->findBy('key', 'specification_date');
        $type = $this->systemSettingRepository->findBy('key', 'specification_type');

        $this->xmlResult($dataQuality, $name->value, $date->value, $type->value, 'Specifikācijas nosaukums: ' . $name->value, $geoProduct->is_inspired);


        $dataQuality->addChild('gmd:lineage')->addChild('gmd:LI_Lineage')->addChild('gmd:statement')
            ->addChild('gco:CharacterString', $geoProduct->data_origin, 'http://www.isotc211.org/2005/gco');

        if (!$geoProduct->is_inspired) {
            $quality = $dataQuality->addChild('qualitylv', '', '')->addChild('LV_Quality');
            $quality->addChild('validationvalue')->addChild('gco:CharacterString', $geoProduct->completeness_value, 'http://www.isotc211.org/2005/gco');
            $quality->addChild('unit')->addChild('gco:CharacterString', $geoProduct->completeness_value ? '%' : '', 'http://www.isotc211.org/2005/gco');
            $quality->addChild('accuracy')->addChild('gco:CharacterString', $geoProduct->precision . ($geoProduct->precision ? 'm' : ''), 'http://www.isotc211.org/2005/gco');
        }

        $name = Str::random(6);
        $metadata->asXML('/srv/www/public/' . $name . '.xml');

        $file = File::get(public_path() . '/' . $name . '.xml');

        $group = env("GEONETWORK_OPEN_ID");
        if ($parentUuid) {
            if ($geoProductService->license_type && $geoProductService->license_type->value !== 'OPEN') {
                $group = env("GEONETWORK_CLOSE_ID");
            }
        } else if ($geoProduct->is_inspired) {
            $group = env("GEONETWORK_INSPIRE_ID");
        }

        $data = [
            'metadataType' => 'METADATA',
            'uuidProcessing' => 'OVERWRITE',
            'publishToAll' => 'false',
            'transformWith' => '_none_',
            'group' => $group,
        ];

        $multipart = [[
            'name' => 'file',
            'contents' => $file,
            'filename' => 'test.xml'
        ]];

        $jar = new CookieJar;

        $metadata = $this->geoNetworkAPI->call('/geonetwork/srv/api/records', $data, 'POST', [], ['multipart' => $multipart, 'add_in_params' => true, 'cookie_jar' => $jar], false, true);

        $key = array_key_first($metadata['metadataInfos'] ?? []);
        $metadataUuid = $metadata['metadataInfos'][$key][0]['uuid'] ?? '0d98d9a4-eca1-4605-9764-bdaadcaab8f2';

        $this->geoNetworkAPI->call('/geonetwork/srv/api/records/' . $metadataUuid . '/editor', ['currTab' => 'XML'], 'GET', ['Accept' => '*/*'], ['cookie_jar' => $jar], false, true);

        File::delete(public_path() . '/' . $name . '.xml');

        if ($geoProduct->is_inspired && env('ENABLE_INSPIRE_VALIDATION_CHECK_ON_PUBLISH')) {
            $inspire = $parentUuid ? ['testsuite' => 'TG version 2.0 - Network services'] : ['testsuite' => 'TG version 2.0 - Data sets and series (for Monitoring)'];
            $inspire = $this->geoNetworkAPI->call('/geonetwork/srv/api/records/' . $metadataUuid . '/validate/inspire', $inspire, 'PUT', ['Accept' => 'text/plain'], ['add_in_params' => true, 'cookie_jar' => $jar]);

            if (!$inspire) {
                Log::info('Inspire validation didnt go through, possible that disk is full');
            }
        }

        return [
            'metadata_uuid' => $metadataUuid,
            'inspire_validation' => $inspire ?? null,
        ];
    }

    public function xmlMainElements($metadata, $type, $uuid)
    {
        if (!$uuid) {
            $uuid = $this->generateUUIDv4();
        }

        // Add fileIdentifier element
        $fileIdentifier = $metadata->addChild('gmd:fileIdentifier');
        $fileIdentifier->addChild('gco:CharacterString', $uuid, 'http://www.isotc211.org/2005/gco');

        // Add language element
        $this->xmlLanguage($metadata);

        // Add characterSet element
        $characterSet = $metadata->addChild('gmd:characterSet');
        $characterSetCode = $characterSet->addChild('gmd:MD_CharacterSetCode', 'utf8');
        $characterSetCode->addAttribute('codeList', 'https://standards.iso.org/iso/19139/resources/gmxCodelists.xml#MD_CharacterSetCode');
        $characterSetCode->addAttribute('codeListValue', 'utf8');

        // Add hierarchyLevel element
        $hierarchyLevel = $metadata->addChild('gmd:hierarchyLevel');
        $scopeCode = $hierarchyLevel->addChild('gmd:MD_ScopeCode', $type);
        $scopeCode->addAttribute('codeList', 'https://standards.iso.org/iso/19139/resources/gmxCodelists.xml#MD_ScopeCode');
        $scopeCode->addAttribute('codeListValue', $type);

        // Add hierarchyLevel element
        $hierarchyLevelName = $metadata->addChild('gmd:hierarchyLevelName');
        $hierarchyLevelName->addChild('gco:CharacterString', $type, 'http://www.isotc211.org/2005/gco');
    }

    public function xmlReferenceSystemInfo($metadata, $code)
    {
        $referenceSystemInfo = $metadata->addChild('gmd:referenceSystemInfo');
        $referenceSystem = $referenceSystemInfo->addChild('gmd:MD_ReferenceSystem');
        $referenceSystemIdentifier = $referenceSystem->addChild('gmd:referenceSystemIdentifier');
        $rsIdentifier = $referenceSystemIdentifier->addChild('gmd:RS_Identifier');
        $codeAnchor = $rsIdentifier->addChild('gmd:code');
        $this->xmlAnchor($codeAnchor, '', $code);
    }

    public function xmlDataIdentification($identificationInfo, $geoProduct)
    {
        $dataIdentification = $identificationInfo->addChild('gmd:MD_DataIdentification');

        $citation = $dataIdentification->addChild('gmd:citation')->addChild('gmd:CI_Citation');
        $this->xmlCitation($citation, $geoProduct->name, Carbon::parse($geoProduct->data_release_date)->format('Y-m-d'), 'publication');

        if (!$geoProduct->is_inspired) {
            $coord = $this->getClassifierValue($geoProduct->coordinate_system_classifier_value_id, true);

            $geoProductFiles = $geoProduct->geoProductFiles;
            foreach ($geoProductFiles as $geoProductFile) {
                if ($geoProductFile->file_format_classifier_value_id) {
                    $code = $this->getClassifierValue($geoProductFile->file_format_classifier_value_id);
                    $version = $geoProductFile->file_format_version;
                    break;
                }
            }

            $citation->addChild('gmd:format')->addChild('gco:CharacterString', $code ?? '', 'http://www.isotc211.org/2005/gco');
            $citation->addChild('gmd:version')->addChild('gco:CharacterString', $version ?? '', 'http://www.isotc211.org/2005/gco');
            $citation->addChild('gmd:coordid')->addChild('gco:CharacterString', $coord->value_code ?? '', 'http://www.isotc211.org/2005/gco');
            $citation->addChild('gmd:coordname')->addChild('gco:CharacterString', $coord->translation ?? '', 'http://www.isotc211.org/2005/gco');
        }

        $this->xmlDate($citation, Carbon::parse($geoProduct->data_updated_at)->format('Y-m-d'), 'revision');
        $this->xmlDate($citation, Carbon::now()->format('Y-m-d'), 'creation');

        $citation->addChild('gmd:identifier')
            ->addChild('gmd:MD_Identifier')->addChild('gmd:code')
            ->addChild('gco:CharacterString', env('BASE_FRONTEND_URI') . '/geonetwork/srv/api/records/' . $geoProduct->metadata_uuid . '/formatters/xml', 'http://www.isotc211.org/2005/gco');

        $abstract = $dataIdentification->addChild('gmd:abstract');
        $abstract->addChild('gco:CharacterString', htmlspecialchars(html_entity_decode(strip_tags($geoProduct->description))), 'http://www.isotc211.org/2005/gco');

        // Add pointOfContact
        $responsibleParty = $dataIdentification->addChild('gmd:pointOfContact')->addChild('gmd:CI_ResponsibleParty');
        $this->xmlContact($responsibleParty, $geoProduct->email, $geoProduct->organization_name);

        $code = $this->getClassifierValue($geoProduct->inspired_data_classifier_value_id);
        $this->xmlKeyword($dataIdentification, $code, 'GEMET - INSPIRE themes, version 1.0', '2008-06-01', 'publication');

        if ($geoProduct->primary_data_theme_classifier_value_id) {
            $code = $this->getClassifierValue($geoProduct->primary_data_theme_classifier_value_id);
            $this->xmlKeyword($dataIdentification, $code, 'INSPIRE priority data set', '2018-04-04', 'publication');
        }

        $code = $this->getClassifierValue($geoProduct->keyword_classifier_value_id);
        $this->xmlKeyword($dataIdentification, $code, 'GEMET', '2020-10-21', 'creation');

        $this->xmlResourceConstraints($dataIdentification, 'accessConstraints', 'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/noLimitations', $geoProduct->enable_access_and_use_restrictions ? $geoProduct->access_and_use_restrictions : 'no limitations to public access');
        $this->xmlResourceConstraints($dataIdentification, 'useConstraints', 'http://inspire.ec.europa.eu/metadata-codelist/ConditionsApplyingToAccessAndUse/conditionsUnknown', $geoProduct->enable_access_and_use_conditions ? $geoProduct->access_and_use_conditions : 'conditions unknown');

        $repTypeCode = $dataIdentification->addChild('gmd:spatialRepresentationType')->addChild('MD_SpatialRepresentationTypeCode', 'vector');
        $repTypeCode->addAttribute('codeList', 'https://standards.iso.org/iso/19139/resources/gmxCodelists.xml#MD_SpatialRepresentationTypeCode');
        $repTypeCode->addAttribute('codeListValue', 'vector');

        $code = $this->getClassifierValue($geoProduct->scale_classifier_value_id);
        $dataIdentification->addChild('gmd:spatialResolution')->addChild('gmd:MD_Resolution')->addChild('gmd:equivalentScale')
            ->addChild('gmd:MD_RepresentativeFraction')->addChild('gmd:denominator')->addChild('gco:Integer', $code, 'http://www.isotc211.org/2005/gco');

        $this->xmlLanguage($dataIdentification);

        $topicCategory = $dataIdentification->addChild('gmd:topicCategory');
        $topicCategory->addChild('gmd:MD_TopicCategoryCode', 'transportation');

        //extent
        $this->xmlExtent($dataIdentification);
    }

    public function xmlServiceIdentification($identificationInfo, $geoProduct, $geoProductService, $parentUuid)
    {
        $code = $this->getClassifierValue($geoProductService->service_type_classifier_value_id);
        $type = '';
        switch ($code) {
            case 'WMS':
            case 'INSPIRE_VIEW':
                $type = 'WMS';
                break;
            case 'WFS':
            case 'FEATURE_DOWNLOAD':
                $type = 'WFS';
                break;
        }

        $serviceIdentification = $identificationInfo->addChild('srv:SV_ServiceIdentification', '', 'http://www.isotc211.org/2005/srv');

        $citation = $serviceIdentification->addChild('gmd:citation', '', 'http://www.isotc211.org/2005/gmd')->addChild('gmd:CI_Citation');

        $this->xmlCitation($citation, $geoProduct->name, Carbon::parse($geoProduct->data_release_date)->format('Y-m-d'), 'publication');

        if (!$geoProduct->is_inspired) {
            $coord = $this->getClassifierValue($geoProduct->coordinate_system_classifier_value_id, true);
            $code = $this->getClassifierValue($geoProductService->file_format_classifier_value_id);
            $version = $geoProductService->file_format_version;

            $citation->addChild('gmd:format')->addChild('gco:CharacterString', $code ?? '', 'http://www.isotc211.org/2005/gco');
            $citation->addChild('gmd:version')->addChild('gco:CharacterString', $version ?? '', 'http://www.isotc211.org/2005/gco');
            $citation->addChild('gmd:coordid')->addChild('gco:CharacterString', $coord->value_code ?? '', 'http://www.isotc211.org/2005/gco');
            $citation->addChild('gmd:coordname')->addChild('gco:CharacterString', $coord->translation ?? '', 'http://www.isotc211.org/2005/gco');
        }

        $this->xmlCitation($citation, $geoProduct->name . ' ' . $type, Carbon::now()->format('Y-m-d'), 'publication');
        $this->xmlDate($citation, Carbon::parse($geoProduct->data_updated_at)->format('Y-m-d'), 'revision');
        $this->xmlDate($citation, Carbon::now()->format('Y-m-d'), 'creation');

        $citation->addChild('gmd:identifier')
            ->addChild('gmd:MD_Identifier')->addChild('gmd:code')
            ->addChild('gco:CharacterString', $this->generateUUIDv4(), 'http://www.isotc211.org/2005/gco');

        $abstract = $serviceIdentification->addChild('gmd:abstract', '', 'http://www.isotc211.org/2005/gmd');
        $abstract->addChild('gco:CharacterString', htmlspecialchars(html_entity_decode(strip_tags($geoProductService->description)) . ' (' . config('geo.base_frontend_uri') . '/main?geoProductId=' . $geoProduct->id . ')'), 'http://www.isotc211.org/2005/gco');

        // Add pointOfContact
        $responsibleParty = $serviceIdentification->addChild('gmd:pointOfContact', '', 'http://www.isotc211.org/2005/gmd')->addChild('gmd:CI_ResponsibleParty');
        $this->xmlContact($responsibleParty, $geoProduct->email, $geoProduct->organization_name);

        //graphicoverview
        $browserGraphic = $serviceIdentification->addChild('gmd:graphicOverview', '', 'http://www.isotc211.org/2005/gmd')->addChild('gmd:MD_BrowseGraphic');
        $browserGraphic->addChild('gmd:fileName')->addChild('gco:CharacterString', '', 'http://www.isotc211.org/2005/gco');
        $browserGraphic->addChild('gmd:fileDescription')->addChild('gco:CharacterString', 'large_thumbnail', 'http://www.isotc211.org/2005/gco');
        $browserGraphic->addChild('gmd:fileType')->addChild('gco:CharacterString', 'png', 'http://www.isotc211.org/2005/gco');

        //descriptiveKeywords
        $code = $this->getClassifierValue($geoProduct->keyword_classifier_value_id);
        $keyword = $serviceIdentification->addChild('gmd:descriptiveKeywords', '', 'http://www.isotc211.org/2005/gmd')->addChild('gmd:MD_Keywords');
        $key = $keyword->addChild('gmd:keyword');
        $this->xmlAnchor($key, 'http://inspire.ec.europa.eu/theme/tn', $code);

        $keywordTypeCode = $keyword->addChild('gmd:type')->addChild('gmd:MD_KeywordTypeCode', 'theme');
        $keywordTypeCode->addAttribute('codeList', 'https://standards.iso.org/iso/19139/resources/gmxCodelists.xml#MD_KeywordTypeCode');
        $keywordTypeCode->addAttribute('codeListValue', 'theme');
        $citation = $keyword->addChild('gmd:thesaurusName')->addChild('gmd:CI_Citation');
        $this->xmlCitation($citation, 'GEMET - INSPIRE themes, version 1.0', '2008-06-01', 'publication');

        $keyword = $serviceIdentification->addChild('gmd:descriptiveKeywords', '', 'http://www.isotc211.org/2005/gmd')->addChild('gmd:MD_Keywords');
        $keyword->addChild('gmd:keyword')->addChild('gco:CharacterString', 'inspireidentified', 'http://www.isotc211.org/2005/gco');

        $keyword = $serviceIdentification->addChild('gmd:descriptiveKeywords', '', 'http://www.isotc211.org/2005/gmd')->addChild('gmd:MD_Keywords');
        $keyword->addChild('gmd:keyword')->addChild('gco:CharacterString', 'infoMapAccessService', 'http://www.isotc211.org/2005/gco');

        $this->xmlResourceConstraints($serviceIdentification, 'accessConstraints', 'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/noLimitations', 'no limitations to public access');
        $this->xmlResourceConstraints($serviceIdentification, 'useConstraints', 'http://inspire.ec.europa.eu/metadata-codelist/ConditionsApplyingToAccessAndUse/conditionsUnknown', 'Apstākļi nezināmi');

        $serviceIdentification->addChild('srv:serviceType')->addChild('gco:LocalName', $type === 'WMS' ? 'view' : 'download', 'http://www.isotc211.org/2005/gco');

        $this->xmlExtent($serviceIdentification);

        $couplingType = $serviceIdentification->addChild('srv:couplingType')->addChild('srv:SV_CouplingType ', 'tight');
        $couplingType->addAttribute('codeList', 'https://standards.iso.org/iso/19115/resources/Codelists/cat/codelists.xml#SV_CouplingType');
        $couplingType->addAttribute('codeListValue', 'tight');

        $url = $geoProductService->dpps_link;
        if ($geoProductService->license_type && $geoProductService->license_type->value !== 'OPEN') {
            $url = config('geo.base_frontend_uri') . '/main?geoProductId=' . $geoProduct->id;
        }

        $operation = $serviceIdentification->addChild('srv:containsOperations')->addChild('srv:SV_OperationMetadata');
        $operation->addChild('srv:operationName')->addChild('gco:CharacterString', 'GetCapabilities', 'http://www.isotc211.org/2005/gco');
        $dcp = $operation->addChild('srv:DCP')->addChild('srv:DCPList', 'WebServices');
        $dcp->addAttribute('codeList', 'https://standards.iso.org/iso/19115/resources/Codelists/cat/codelists.xml#DCPList');
        $dcp->addAttribute('codeListValue', 'WebServices');
        $operation->addChild('srv:connectPoint')->addChild('gmd:CI_OnlineResource', '', 'http://www.isotc211.org/2005/gmd')
            ->addChild('gmd:linkage')->addChild('gmd:URL', htmlspecialchars($url));

        $raw = '<srv:operatesOn xmlns:srv="http://www.isotc211.org/2005/srv" xmlns:xlink="http://www.w3.org/1999/xlink" uuidref="' . $parentUuid . '" xlink:href="' . env('APP_URL') . '/geonetwork/srv/api/records/' . $parentUuid . '/formatters/xml' . '"/>';

        $childDom = dom_import_simplexml($serviceIdentification);
        $rawXmlDom = new DOMDocument();
        $rawXmlDom->loadXML($raw);
        $rawXmlNode = $rawXmlDom->documentElement;
        $importedNode = $childDom->ownerDocument->importNode($rawXmlNode, true);

        $childDom->appendChild($importedNode);

    }

    public function xmlExtent($identification)
    {
        $extent = $identification->addChild('gmd:extent')->addChild('gmd:EX_Extent', '', 'http://www.isotc211.org/2005/gmd');
        $geographicElement = $extent->addChild('gmd:geographicElement')->addChild('gmd:EX_GeographicBoundingBox');
        $geographicElement->addChild('gmd:extentTypeCode',)->addChild('gco:Boolean', 'true', 'http://www.isotc211.org/2005/gco');
        $west = $this->systemSettingRepository->findBy('key', 'w_length');
        $geographicElement->addChild('gmd:westBoundLongitude',)->addChild('gco:Decimal', $west->value, 'http://www.isotc211.org/2005/gco');
        $east = $this->systemSettingRepository->findBy('key', 'e_length');
        $geographicElement->addChild('gmd:eastBoundLongitude')->addChild('gco:Decimal', $east->value, 'http://www.isotc211.org/2005/gco');
        $south = $this->systemSettingRepository->findBy('key', 's_length');
        $geographicElement->addChild('gmd:southBoundLatitude')->addChild('gco:Decimal', $south->value, 'http://www.isotc211.org/2005/gco');
        $north = $this->systemSettingRepository->findBy('key', 'n_length');
        $geographicElement->addChild('gmd:northBoundLatitude')->addChild('gco:Decimal', $north->value, 'http://www.isotc211.org/2005/gco');
    }

    public function xmlCitation($citation, $title, $date, $reason)
    {
        $citation->addChild('gmd:title')
            ->addChild('gco:CharacterString', htmlspecialchars($title), 'http://www.isotc211.org/2005/gco');

        $this->xmlDate($citation, $date, $reason);
    }

    public function xmlDate($citation, $date, $reason)
    {
        $date1 = $citation->addChild('gmd:date')->addChild('gmd:CI_Date');
        $date1->addChild('gmd:date')->addChild('dco:Date', $date, 'http://www.isotc211.org/2005/gco');
        $dateType1 = $date1->addChild('gmd:dateType')->addChild('gmd:CI_DateTypeCode', $reason);
        $dateType1->addAttribute('codeList', 'https://standards.iso.org/iso/19139/resources/gmxCodelists.xml#CI_DateTypeCode');
        $dateType1->addAttribute('codeListValue', $reason);
    }

    public function xmlAnchor($anchor, $link, $text)
    {
        $raw = '<gmx:Anchor xmlns:gmx="http://www.isotc211.org/2005/gmx" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' . $link . '">' . $text . '</gmx:Anchor>';

        $childDom = dom_import_simplexml($anchor);
        $rawXmlDom = new DOMDocument();
        $rawXmlDom->loadXML($raw);
        $rawXmlNode = $rawXmlDom->documentElement;
        $importedNode = $childDom->ownerDocument->importNode($rawXmlNode, true);

        $childDom->appendChild($importedNode);
    }

    public function xmlKeyword($dataIdentification, $keyword, $title, $date, $reason)
    {
        $descriptiveKeyword = $dataIdentification->addChild('gmd:descriptiveKeywords')->addChild('gmd:MD_Keywords');
        $descriptiveKeyword->addChild('gmd:keyword')->addChild('gco:CharacterString', $keyword, 'http://www.isotc211.org/2005/gco');;
        $citation = $descriptiveKeyword->addChild('gmd:thesaurusName')->addChild('gmd:CI_Citation');
        $this->xmlCitation($citation, $title, $date, $reason);
    }

    public function xmlResult($result, $title, $date, $reason, $explanation, $pass = true)
    {
        $domainConsistency = $result->addChild('gmd:report')->addChild('gmd:DQ_DomainConsistency');
        $domainConsistency->addChild('gmd:measureIdentification')->addChild('gmd:MD_Identifier')->addChild('gmd:code')
            ->addChild('gco:CharacterString', $title, 'http://www.isotc211.org/2005/gco');

        $conformanceResult = $domainConsistency->addChild('gmd:result')->addChild('gmd:DQ_ConformanceResult');


        $specification = $conformanceResult->addChild('gmd:specification')->addChild('gmd:CI_Citation');

        $this->xmlCitation($specification, $title, $date, $reason);

        $conformanceResult->addChild('gmd:explanation')
            ->addChild('gco:CharacterString', $explanation, 'http://www.isotc211.org/2005/gco');

        $conformanceResult->addChild('gmd:pass')
            ->addChild('gco:Boolean', $pass ? 'true' : 'false', 'http://www.isotc211.org/2005/gco');
    }

    public function xmlLanguage($language)
    {
        $language = $language->addChild('gmd:language');
        $languageCode = $language->addChild('gmd:LanguageCode', 'lav');
        $languageCode->addAttribute('codeList', 'http://www.loc.gov/standards/iso639-2/');
        $languageCode->addAttribute('codeListValue', 'lav');
    }

    public function xmlContact($responsibleParty, $individualName, $orgName)
    {
        $responsibleParty->addChild('gmd:individualName')
            ->addChild('gco:CharacterString', $individualName, 'http://www.isotc211.org/2005/gco');
        $responsibleParty->addChild('gmd:organisationName')
            ->addChild('gco:CharacterString', $orgName, 'http://www.isotc211.org/2005/gco');
        // Add contactInfo element
        $contactInfo = $responsibleParty->addChild('gmd:contactInfo');
        $ciContact = $contactInfo->addChild('gmd:CI_Contact');

        // Add address element
        $address = $ciContact->addChild('gmd:address');
        $ciAddress = $address->addChild('gmd:CI_Address');
        $ciAddress->addChild('gmd:electronicMailAddress')->addChild('gco:CharacterString', $individualName, 'http://www.isotc211.org/2005/gco');

        $onlineResource = $ciContact->addChild('gmd:onlineResource')->addChild('gmd:CI_OnlineResource');
        $onlineResource->addChild('gmd:linkage')->addChild('gmd:URL', env('APP_URL'));

        $roleCode = $responsibleParty->addChild('gmd:role')->addChild('gmd:CI_RoleCode', 'pointOfContact');
        $roleCode->addAttribute('codeList', 'https://standards.iso.org/iso/19139/resources/gmxCodelists.xml#CI_RoleCode');
        $roleCode->addAttribute('codeListValue', 'pointOfContact');
    }

    public function xmlTransferOptions($distributor, $url, $type)
    {
        $onlineResource = $distributor->addChild('gmd:transferOptions')->addChild('gmd:MD_DigitalTransferOptions')->addChild('gmd:onLine')->addChild('gmd:CI_OnlineResource');
        $onlineResource->addChild('gmd:linkage')->addChild('gmd:URL', htmlspecialchars($url));
        $function = $onlineResource->addChild('gmd:function')->addChild('gco:CI_OnLineFunctionCode', $type);
        $function->addAttribute('codeList', 'https://standards.iso.org/iso/19139/resources/gmxCodelists.xml#CI_OnLineFunctionCode');
        $function->addAttribute('codeListValue', $type);
    }

    public function xmlResourceConstraints($dataIdentification, $type, $link, $text)
    {
        $legalConstaints = $dataIdentification->addChild('gmd:resourceConstraints', '', 'http://www.isotc211.org/2005/gmd')->addChild('gmd:MD_LegalConstraints');
        $restrictionCode = $legalConstaints->addChild('gmd:' . $type)->addChild('gmd:MD_RestrictionCode', 'otherRestrictions');
        $restrictionCode->addAttribute('codeList', 'https://standards.iso.org/iso/19139/resources/gmxCodelists.xml#MD_RestrictionCode');
        $restrictionCode->addAttribute('codeListValue', 'otherRestrictions');

        $otherConstraint = $legalConstaints->addChild('gmd:otherConstraints');
        $this->xmlAnchor($otherConstraint, $link, $text);
    }

    public function getClassifierValue($id, $full = false)
    {
        if ($id) {
            $classifierValue = $this->classifierValueRepository->findById($id);

            if ($full) {
                return $classifierValue;
            }

            return $classifierValue->value_code;
        }
    }
}
