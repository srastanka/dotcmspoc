package ca.architech.dotcms.api.model;

public enum Structure {
    ADVERTISEMENT("Advertisement", "Advertisement"),
    ADVERTISEMENT_GROUP("Advertisement Group", "AdvertisementGroup"),
    BANNER("Banner","Banner"),
    BANNER_CAROUSEL("Banner Carousel", "BannerCarousel"),
    BASIC("Basic", "Basic"),
    BASIC_GROUP("Basic Group", "BasicGroup"),
    BASIC_GROUP_TABS("Basic Group Tabs", "BasicGroupTabs"),
    CHANNEL_VIDEO("Channel Video",""),
    COLLOQUY_RECOGNIZES("COLLOQUY Recognizes",""),
    COMPANY("Company","Company"),
    CONTENT_GENERIC("Content (Generic)","webPageContent"),
    CONTENT_GATE("Content Gate","ContentGate"),
    CONTRIBUTORS("Contributors","Contributors"),
    EVENT("Event","Event"),
    EVENT_SESSION("Event Session","EventSession"),
    EVENT_SESSION_GROUP("Event Session Group","EventSessionGroup"),
    FILE_ASSET("File Asset", "FileAsset"),
    LOYALTY_PROGRAM("Loyalty Program","LoyaltyProgram"),
    LOYALTY_STRATEGY("Loyalty Strategy","LoyaltyStrategy"),
    LOYALTY_STRATEGY_GROUPED_LIST("Loyalty Strategy Grouped List","LoyaltyStrategyGroupedList"),
    MAGAZINE("Magazine","Magazine"),
    NEWS_ITEM("News Item","NewsItem"),
    NEWS_ITEM_GROUPED_LIST("News Item Grouped List","NewsItemGroupedList"),
    PAGE("Page","Page"),
    PARTNER("Partner","Partner"),
    PARTNER_CONTACT("Partner Contact","PartnerContact"),
    PERSON("Person","Person"),
    REPORT("Report","Report"),
    STAFF("Staff","Staff"),
    VIDEO("Video","Video");

    private final String structureName;
    private final String velocityName;

    Structure(String structureName, String velocityName) {
        this.structureName = structureName;
        this.velocityName = velocityName;
    }

    public String structureName() {
        return structureName;
    }

    public String velocityName() {
        return velocityName;
    }
}
