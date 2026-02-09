import { Controller, Get, Query, Ip } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get()
    search(@Query('q') query: string, @Ip() ip: string) {
        return this.searchService.search(query, ip);
    }
}
