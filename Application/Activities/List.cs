
using Application.Core;
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
        public class Query : IRequest <Result<List<ActivityDto>>> //<Result<List<Activity>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            //private readonly ILogger<List> _logger;
        private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper) 
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken) //, CancellationToken cancellationToken
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

                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);
                
                //var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);

                //return await _context.Activities.ToListAsync();
                return Result<List<ActivityDto>>.Success(activities); //  _context.Activities.ToListAsync();
            }
        }
    }
}