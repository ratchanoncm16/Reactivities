
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest <Result<PagedList<ActivityDto>>> //<Result<List<Activity>>>
        {
            public ActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _context;
            //private readonly ILogger<List> _logger;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper , IUserAccessor userAccessor) 
            {
                _mapper = mapper;
               _userAccessor = userAccessor;
                _context = context;
            }
            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken) //, CancellationToken cancellationToken
            {
                //cancel token
                // try
                // {
                //     for (int i = 0; i < 10; i++)
                //     {
                //         cancellationToken.ThrowIfCancellationRequested();
                //         await Task.Delay(1000,cancellationToken);
                //         _logger.LogInformation($"Task {i} has completed");
                //     }
                // }
                // catch (System.Exception)
                // {
                //     _logger.LogInformation("Task was cancelled");
                // }

                // var activities = await _context.Activities
                //     .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                //     .ToListAsync(cancellationToken);
                
                //var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);

                //return await _context.Activities.ToListAsync();
                //return Result<PagedList<ActivityDto>>.Success(activities); //  _context.Activities.ToListAsync();

                var query = _context.Activities
                    .Where(d => d.Date >= request.Params.StartDate)
                    .OrderBy(d => d.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUsername() })
                    .AsQueryable();

                if (request.Params.IsGoing && !request.Params.IsHost)
                {
                    query = query.Where(x => x.Attendees.Any(a => a.Username == _userAccessor.GetUsername()));
                }

                if (request.Params.IsHost && !request.Params.IsGoing)
                {
                    query = query.Where(x => x.HostUsername == _userAccessor.GetUsername());
                }

                return Result<PagedList<ActivityDto>>.Success(
                    await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                );

            }
        }
    }
}